import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto'
import { initStore, snapshot, updateStore } from './store.mjs'
import { generateBalancedTeams } from '../shared/balance.mjs'
import { playerPositions } from '../shared/positions.mjs'
import { MAX_SELECTED_PLAYERS } from '../shared/limits.mjs'
const here = path.dirname(fileURLToPath(import.meta.url))
const production = process.env.NODE_ENV === 'production'
const port = Number(process.env.PORT || 3030)
if (production && (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD_HASH || !process.env.DATABASE_URL)) throw new Error('Produção exige ADMIN_USERNAME, ADMIN_PASSWORD_HASH e DATABASE_URL persistente.')
if (production && !/^[\da-f]{32}:[\da-f]{128}$/i.test(process.env.ADMIN_PASSWORD_HASH)) throw new Error('ADMIN_PASSWORD_HASH inválido. Gere com npm run admin:hash.')
const adminUser = production ? process.env.ADMIN_USERNAME : process.env.ADMIN_USERNAME || 'admin'
const devHash = () => { const salt = randomBytes(16).toString('hex'); return `${salt}:${scryptSync('admin',salt,64).toString('hex')}` }
const passwordHash = process.env.ADMIN_PASSWORD_HASH || devHash()
const sessions = new Map()
const attempts = new Map()
const cookieName = 'png_admin_session'
const securityHeaders = { 'X-Content-Type-Options':'nosniff', 'X-Frame-Options':'DENY', 'Referrer-Policy':'strict-origin-when-cross-origin', ...(production?{'Strict-Transport-Security':'max-age=31536000; includeSubDomains'}:{}) }
function validPassword(password) {
  const [salt,hash] = passwordHash.split(':')
  if (!salt || !hash || !/^[\da-f]{128}$/i.test(hash)) return false
  const expected = Buffer.from(hash,'hex')
  const actual = scryptSync(password,salt,expected.length)
  return timingSafeEqual(actual,expected)
}
if (production && validPassword('admin')) throw new Error('A senha de desenvolvimento não pode ser usada em produção.')
function json(res,status,body,headers={}) {
  res.writeHead(status,{ 'Content-Type':'application/json; charset=utf-8', 'Cache-Control':'no-store', ...securityHeaders, ...headers })
  res.end(JSON.stringify(body))
}
function fail(message,status=400) { const error = new Error(message); error.status=status; throw error }
async function body(req) {
  let raw = ''
  for await (const chunk of req) {
    raw += chunk
    if (raw.length > 1_000_000) fail('Solicitação muito grande.',413)
  }
  let input
  try { input = JSON.parse(raw || '{}') } catch { fail('JSON inválido.') }
  if (!input || typeof input !== 'object' || Array.isArray(input)) fail('Dados inválidos.')
  return input
}
function session(req) {
  const token = req.headers.cookie?.split(';').map(item=>item.trim()).find(item=>item.startsWith(`${cookieName}=`))?.slice(cookieName.length+1)
  if (!token) return null
  const expires = sessions.get(token)
  if (!expires || expires < Date.now()) { sessions.delete(token); return null }
  return token
}
function sessionCookie(token) { return `${cookieName}=${token}; HttpOnly; SameSite=Strict; Path=/api/admin${production?'; Secure':''}` }
function validatePlayer(input,current={}) {
  const nome = typeof input.nome === 'string' ? input.nome.trim() : current.nome
  if (!nome || nome.length > 80) fail('Informe um nome com até 80 caracteres.')
  const apelido = typeof input.apelido === 'string' ? input.apelido.trim() : current.apelido || ''
  const foto = typeof input.foto === 'string' ? input.foto.trim() : current.foto || ''
  if (apelido.length > 60) fail('Apelido muito longo.')
  if (foto && (!/^https:\/\//.test(foto) || foto.length > 500)) fail('Use uma URL HTTPS válida para a foto.')
  const nota = input.nota === '' || input.nota === null ? null : input.nota === undefined ? current.nota ?? null : Number(input.nota)
  if (nota !== null && (!Number.isFinite(nota) || nota < 0 || nota > 10 || Math.round(nota*10) !== nota*10)) fail('A nota deve estar entre 0 e 10, com uma casa decimal.')
  const posicao = input.posicao === undefined ? current.posicao || '' : input.posicao
  if (typeof posicao !== 'string' || (posicao !== '' && !playerPositions.includes(posicao))) fail('Escolha uma posição válida para o jogador.')
  return { ...current, nome, apelido, foto, nota, posicao, ativo: typeof input.ativo === 'boolean' ? input.ativo : current.ativo ?? true }
}
function validateMatch(input) {
  const name = typeof input.name === 'string' ? input.name.trim() : ''
  const date = input.date
  const time = input.time || ''
  const teamCount = Number(input.teamCount)
  const playersPerTeam = Number(input.playersPerTeam)
  if (!name || name.length > 80) fail('Informe o nome da pelada.')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`)) || new Date(`${date}T00:00:00Z`).toISOString().slice(0,10)!==date) fail('Informe uma data válida.')
  if (time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) fail('Horário inválido.')
  if (!Number.isInteger(teamCount) || teamCount < 2 || teamCount > 8) fail('Escolha de 2 a 8 times.')
  if (!Number.isInteger(playersPerTeam) || playersPerTeam < 2 || playersPerTeam > 12) fail('Escolha de 2 a 12 jogadores por time.')
  if (teamCount * playersPerTeam > MAX_SELECTED_PLAYERS) fail(`A pelada pode ter no máximo ${MAX_SELECTED_PLAYERS} jogadores em campo.`)
  return { name, date, time, teamCount, playersPerTeam }
}
function matchById(store,id) { const match = store.matches.find(item=>item.id===id); if (!match) fail('Pelada não encontrada.',404); return match }
function publicPlayer(player) { return { id:player.id, nome:player.nome, apelido:player.apelido, foto:player.foto, nota:player.nota, posicao:player.posicao||'', ativo:player.ativo } }
async function api(req,res,url) {
  if (url.pathname === '/api/admin/login' && req.method === 'POST') {
    const ip = req.socket.remoteAddress || ''
    const bucket = attempts.get(ip) || { count:0, until:Date.now()+15*60_000 }
    if (bucket.until < Date.now()) { bucket.count=0; bucket.until=Date.now()+15*60_000 }
    if (bucket.count >= 10) fail('Muitas tentativas. Tente novamente em alguns minutos.',429)
    const input = await body(req)
    const passwordCorrect = typeof input.password === 'string' && input.password.length <= 256 && validPassword(input.password)
    if (input.username !== adminUser || !passwordCorrect) {
      bucket.count++; attempts.set(ip,bucket); fail('Usuário ou senha incorretos.',401)
    }
    attempts.delete(ip)
    const token = randomBytes(32).toString('base64url')
    sessions.set(token,Date.now()+12*60*60_000)
    return json(res,200,{ authenticated:true, username:adminUser },{ 'Set-Cookie':sessionCookie(token) })
  }
  const token = session(req)
  if (!token) fail('Acesso restrito à diretoria.',401)
  if (url.pathname === '/api/admin/session' && req.method === 'GET') return json(res,200,{ authenticated:true, username:adminUser })
  if (url.pathname === '/api/admin/logout' && req.method === 'POST') {
    if (req.headers['x-png-admin'] !== '1') fail('Solicitação inválida.',403)
    sessions.delete(token)
    return json(res,200,{ authenticated:false },{ 'Set-Cookie':`${cookieName}=; HttpOnly; SameSite=Strict; Path=/api/admin; Max-Age=0${production?'; Secure':''}` })
  }
  if (req.method !== 'GET' && req.headers['x-png-admin'] !== '1') fail('Solicitação inválida.',403)
  const parts = url.pathname.split('/').filter(Boolean)
  if (parts[2] === 'players') {
    if (parts.length === 3 && req.method === 'GET') return json(res,200,(await snapshot()).players)
    if (parts.length === 3 && req.method === 'POST') {
      const input = await body(req)
      const player = validatePlayer(input)
      player.id = randomUUID()
      await updateStore(store=>store.players.push(player))
      return json(res,201,player)
    }
    if (parts.length === 4 && req.method === 'PATCH') {
      const input = await body(req)
      const player = await updateStore(store=>{
        const index = store.players.findIndex(item=>item.id===parts[3])
        if(index<0) fail('Jogador não encontrado.',404)
        store.players[index] = validatePlayer(input,store.players[index])
        return store.players[index]
      })
      return json(res,200,player)
    }
  }
  if (parts[2] === 'matches') {
    if (parts.length === 3 && req.method === 'GET') return json(res,200,(await snapshot()).matches.map(({ id,name,date,time,teamCount,playersPerTeam,selectedIds,status,draws,officialDrawId })=>({id,name,date,time,teamCount,playersPerTeam,playerCount:selectedIds.length,status,drawCount:draws.length,officialDrawId})).sort((a,b)=>b.date.localeCompare(a.date)))
    if (parts.length === 3 && req.method === 'POST') {
      const fields = validateMatch(await body(req))
      const match = { id:randomUUID(), ...fields, status:'draft', selectedIds:[], draws:[], officialDrawId:null, createdAt:new Date().toISOString() }
      await updateStore(store=>store.matches.push(match))
      return json(res,201,match)
    }
    if (parts.length >= 4) {
      const id = parts[3]
      if (parts.length === 4 && req.method === 'GET') return json(res,200,matchById(await snapshot(),id))
      if (parts.length === 4 && req.method === 'PATCH') {
        const input = await body(req)
        const match = await updateStore(store=>{
          const match = matchById(store,id)
          if(match.status==='confirmed') fail('A escalação confirmada não pode ser alterada.',409)
          if (!Array.isArray(input.selectedIds) || new Set(input.selectedIds).size !== input.selectedIds.length) fail('Seleção de jogadores inválida.')
          if (input.selectedIds.length > MAX_SELECTED_PLAYERS) fail(`Selecione no máximo ${MAX_SELECTED_PLAYERS} jogadores.`)
          const players = new Map(store.players.map(player=>[player.id,player]))
          if (input.selectedIds.some(playerId=>!players.get(playerId)?.ativo)) fail('Selecione apenas jogadores ativos.')
          match.selectedIds = input.selectedIds
          match.draws = []
          return match
        })
        return json(res,200,match)
      }
      if (parts[4] === 'draw' && req.method === 'POST') {
        const input = await body(req)
        const draw = await updateStore(store=>{
          const match = matchById(store,id)
          if(match.status==='confirmed') fail('A escalação já foi confirmada.',409)
          const slots = match.teamCount*match.playersPerTeam
          const selected = match.selectedIds.map(playerId=>store.players.find(player=>player.id===playerId)).filter(Boolean)
          if(selected.length<slots) fail(`Você selecionou ${selected.length} jogadores para ${match.teamCount} times de ${match.playersPerTeam}.`)
          const extras = selected.length-slots
          let reserves = []
          if(extras) {
            if(input.reserveMode==='manual') {
              const ids = input.reserveIds
              if(!Array.isArray(ids) || ids.length!==extras || new Set(ids).size!==ids.length || ids.some(playerId=>!selected.some(player=>player.id===playerId))) fail(`Escolha exatamente ${extras} reserva(s).`)
              reserves=selected.filter(player=>ids.includes(player.id))
            } else if(input.reserveMode==='random') {
              const shuffled=[...selected]
              for(let i=shuffled.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]] }
              reserves=shuffled.slice(0,extras)
            } else fail('Escolha como definir os reservas.')
          }
          const lineup = selected.filter(player=>!reserves.some(reserve=>reserve.id===player.id))
          if(lineup.some(player=>player.nota===null || player.nota===undefined)) fail('Todos os jogadores em campo precisam de nota antes do sorteio.')
          const previous = match.draws.at(-1)
          const result = generateBalancedTeams(lineup,match.teamCount,match.playersPerTeam,{ avoidSignature:previous?.signature })
          const draw = { id:randomUUID(), createdAt:new Date().toISOString(), ...result,
            teams:result.teams.map(team=>({...team,players:team.players.map(publicPlayer)})),
            reserves:reserves.map(publicPlayer) }
          match.draws.push(draw)
          return draw
        })
        return json(res,201,draw)
      }
      if (parts[4] === 'confirm' && req.method === 'POST') {
        const input=await body(req)
        const match=await updateStore(store=>{
          const match=matchById(store,id)
          if(match.status==='confirmed') fail('Escalação já confirmada.',409)
          if(!match.draws.some(draw=>draw.id===input.drawId)) fail('Sorteio não encontrado.',404)
          match.status='confirmed';match.officialDrawId=input.drawId
          return match
        })
        return json(res,200,match)
      }
    }
  }
  fail('Rota administrativa não encontrada.',404)
}
const mime = { '.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.webp':'image/webp','.json':'application/json; charset=utf-8' }
async function serveStatic(req,res,url) {
  const dist=path.resolve(here,'../dist')
  const requested=path.resolve(dist,`.${decodeURIComponent(url.pathname)}`)
  if(!requested.startsWith(dist+path.sep) && requested!==dist) return json(res,403,{error:'Acesso negado.'})
  const candidate=requested===dist?path.join(dist,'index.html'):requested
  try { const data=await readFile(candidate);res.writeHead(200,{'Content-Type':mime[path.extname(candidate)]||'application/octet-stream',...securityHeaders});res.end(data) }
  catch(error) { if(error.code!=='ENOENT') throw error; const data=await readFile(path.join(dist,'index.html'));res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store',...securityHeaders});res.end(data) }
}
await initStore()
createServer(async (req,res)=>{
  try {
    const url=new URL(req.url,`http://${req.headers.host||'localhost'}`)
    if(url.pathname==='/healthz' && req.method==='GET') json(res,200,{ok:true})
    else if(url.pathname.startsWith('/api/admin/')) await api(req,res,url)
    else if(production && (req.method==='GET'||req.method==='HEAD')) await serveStatic(req,res,url)
    else json(res,404,{error:'Rota não encontrada.'})
  } catch(error) { json(res,error.status||500,{error:error.status?error.message:'Erro interno. Tente novamente.'});if(!error.status)console.error(error) }
}).listen(port,production?'0.0.0.0':'127.0.0.1',()=>console.log(`PNG admin API: http://127.0.0.1:${port}`))
