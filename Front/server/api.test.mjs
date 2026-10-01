import test from 'node:test'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { createServer } from 'node:net'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here=path.dirname(fileURLToPath(import.meta.url))
async function freePort(){
  const server=createServer()
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve))
  const port=server.address().port
  await new Promise(resolve=>server.close(resolve))
  return port
}

test('admin flow protects data, persists players, balances teams and confirms an official draw',async()=>{
  const directory=await mkdtemp(path.join(tmpdir(),'png-admin-test-'))
  const port=await freePort()
  const server=spawn(process.execPath,[path.join(here,'index.mjs')],{cwd:path.resolve(here,'..'),env:{...process.env,NODE_ENV:'development',PORT:String(port),PNG_DATA_FILE:path.join(directory,'store.json')},stdio:['ignore','pipe','pipe']})
  let output=''
  server.stderr.on('data',chunk=>{output+=chunk.toString()})
  const ready=new Promise((resolve,reject)=>{
    const timeout=setTimeout(()=>reject(new Error(`Server timeout: ${output}`)),5000)
    server.stdout.on('data',chunk=>{if(chunk.toString().includes('PNG admin API')){clearTimeout(timeout);resolve()}})
    server.once('exit',code=>{clearTimeout(timeout);reject(new Error(`Server exited ${code}: ${output}`))})
  })
  try {
    await ready
    const root=`http://127.0.0.1:${port}/api/admin`
    async function request(url,method='GET',data,cookie='') {
      const response=await fetch(`${root}${url}`,{method,headers:{...(data?{'Content-Type':'application/json'}:{}),...(method!=='GET'?{'X-PNG-Admin':'1'}:{}),...(cookie?{Cookie:cookie}:{})},body:data?JSON.stringify(data):undefined})
      return {response,body:await response.json()}
    }
    assert.equal((await request('/players')).response.status,401)
    const invalid=await request('/login','POST',{username:'admin',password:'wrong'})
    assert.equal(invalid.response.status,401)
    const login=await request('/login','POST',{username:'admin',password:'admin'})
    assert.equal(login.response.status,200)
    const cookie=login.response.headers.get('set-cookie').split(';')[0]
    const seeded=(await request('/players','GET',undefined,cookie)).body
    assert.equal(seeded.length,50)
    assert.equal(seeded.every(player=>player.nota===null),true)
    assert.equal(seeded.every(player=>player.posicao===''),true)
    const positions=['Goleiro','Goleiro','Defesa','Defesa','Lateral','Lateral','Ataque','Ataque']
    for(const [index,player] of seeded.slice(0,8).entries()) {
      const changed=await request(`/players/${player.id}`,'PATCH',{nota:Number(player.id)%10,posicao:positions[index]},cookie)
      assert.equal(changed.response.status,200)
      assert.equal(changed.body.posicao,positions[index])
    }
    const invalidPosition=await request(`/players/${seeded[0].id}`,'PATCH',{posicao:'Técnico'},cookie)
    assert.equal(invalidPosition.response.status,400)
    const tooManySlots=await request('/matches','POST',{name:'Pelada grande',date:'2026-10-01',teamCount:3,playersPerTeam:12},cookie)
    assert.equal(tooManySlots.response.status,400)
    const match=(await request('/matches','POST',{name:'Teste de pelada',date:'2026-10-01',time:'20:00',teamCount:2,playersPerTeam:4},cookie)).body
    assert.ok(match.id)
    assert.equal((await request(`/matches/${match.id}`,'PATCH',{selectedIds:seeded.slice(0,33).map(player=>player.id)},cookie)).response.status,200)
    assert.equal((await request(`/matches/${match.id}`,'PATCH',{selectedIds:seeded.slice(0,34).map(player=>player.id)},cookie)).response.status,400)
    const selectedIds=seeded.slice(0,9).map(player=>player.id)
    assert.equal((await request(`/matches/${match.id}`,'PATCH',{selectedIds},cookie)).response.status,200)
    const first=await request(`/matches/${match.id}/draw`,'POST',{reserveMode:'manual',reserveIds:[selectedIds[8]]},cookie)
    assert.equal(first.response.status,201,JSON.stringify(first.body))
    assert.equal(first.body.teams.length,2)
    assert.equal(first.body.teams.every(team=>team.players.length===4),true)
    for(const position of ['Goleiro','Defesa','Lateral','Ataque']) assert.deepEqual(first.body.teams.map(team=>team.players.filter(player=>player.posicao===position).length),[1,1])
    assert.equal(first.body.reserves.length,1)
    const second=await request(`/matches/${match.id}/draw`,'POST',{reserveMode:'manual',reserveIds:[selectedIds[8]]},cookie)
    assert.equal(second.response.status,201,JSON.stringify(second.body))
    assert.notEqual(second.body.signature,first.body.signature)
    assert.ok(second.body.balanceDifference<=1)
    assert.equal((await request(`/matches/${match.id}/confirm`,'POST',{drawId:second.body.id},cookie)).response.status,200)
    assert.equal((await request(`/matches/${match.id}`,'PATCH',{selectedIds:[]},cookie)).response.status,409)
    const saved=(await request(`/matches/${match.id}`,'GET',undefined,cookie)).body
    assert.equal(saved.officialDrawId,second.body.id)
    assert.equal(saved.status,'confirmed')
    assert.equal((await request('/logout','POST',undefined,cookie)).response.status,200)
    assert.equal((await request('/session','GET',undefined,cookie)).response.status,401)
  } finally {
    server.kill()
    await new Promise(resolve=>server.once('exit',resolve))
    await rm(directory,{recursive:true,force:true})
  }
})
