import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Link, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import PlayerPortrait from '../../Components/PlayerPortrait'
import useRemote from '../../hooks/useRemote'
import { playerCardsUrl, playerImage } from '../../data/seasons'
import { adminApi, dateLabel } from './api'
import { createPoster, downloadPoster, posterFilename } from './poster'
import { playerPositions, positionLabel } from '../../../shared/positions.mjs'
import styles from './Admin.module.css'

function useData(path) {
  const [data,setData]=useState(null)
  const [error,setError]=useState('')
  const [loading,setLoading]=useState(true)
  const refresh=useCallback(async({quiet=false}={})=>{
    if(!quiet)setLoading(true)
    try { setData(await adminApi(path));setError('') }
    catch(e){setError(e.message)}
    finally{setLoading(false)}
  },[path])
  useEffect(()=>{refresh()},[refresh])
  return {data,error,loading,refresh,setData}
}
function Notice({error,success}) { return error?<p className={styles.error} role="alert">{error}</p>:success?<p className={styles.success} role="status">{success}</p>:null }
function Busy({children='Carregando...'}) { return <div className={styles.busy}>{children}</div> }
function PageTitle({eyebrow,title,description,action}) { return <div className={styles.title}><div><span className={styles.eyebrow}>{eyebrow}</span><h1>{title}</h1>{description&&<p>{description}</p>}</div>{action}</div> }
function PlayerFace({player,cards}) { return <PlayerPortrait src={playerImage(player,cards)} name={player.nome} imageClass={styles.face} fallbackClass={styles.fallback} /> }
function RatingControl({player,onSave}) {
  const [value,setValue]=useState(player.nota??''),[saving,setSaving]=useState(false)
  useEffect(()=>setValue(player.nota??''),[player.nota])
  async function commit(){const next=value===''?null:Number(value);if(next===player.nota)return;setSaving(true);try{await onSave(player,next)}finally{setSaving(false)}}
  return <label className={styles.ratingControl}><span>{saving?'Salvando':'Nota'}</span><input aria-label={`Nota de ${player.nome}`} type="number" inputMode="decimal" min="0" max="10" step="0.1" placeholder="—" value={value} onChange={e=>setValue(e.target.value)} onBlur={commit} onKeyDown={e=>{if(e.key==='Enter')e.currentTarget.blur()}} /></label>
}
Notice.propTypes={error:PropTypes.string,success:PropTypes.string}
Busy.propTypes={children:PropTypes.node}
PageTitle.propTypes={eyebrow:PropTypes.string,title:PropTypes.string,description:PropTypes.string,action:PropTypes.node}
PlayerFace.propTypes={player:PropTypes.shape({nome:PropTypes.string.isRequired}).isRequired,cards:PropTypes.array.isRequired}
RatingControl.propTypes={player:PropTypes.shape({nome:PropTypes.string.isRequired,nota:PropTypes.number}).isRequired,onSave:PropTypes.func.isRequired}
function ProtectedShell({onLogout,logoutError,children}) {
  return <div className={styles.admin}><header className={styles.header}><Link to="/admin" className={styles.brand}><span className={styles.brandDot} />PNG <small>DIRETORIA</small></Link><button className={styles.logout} onClick={onLogout}>Sair</button></header><div className={styles.shell}><Notice error={logoutError}/>{children}</div><nav className={styles.bottomNav} aria-label="Menu da diretoria"><Link to="/admin">Início</Link><Link to="/admin/matches/new">Nova pelada</Link><Link to="/admin/players">Jogadores</Link><Link to="/admin/history">Histórico</Link></nav></div>
}
ProtectedShell.propTypes={onLogout:PropTypes.func.isRequired,logoutError:PropTypes.string,children:PropTypes.node.isRequired}
function Login({onLogin}) {
  const [username,setUsername]=useState(''),[password,setPassword]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false)
  async function submit(event){event.preventDefault();setError('');setBusy(true);try{await onLogin(username,password)}catch(e){setError(e.message)}finally{setBusy(false)}}
  return <div className={styles.loginPage}><div className={styles.loginCard}><span className={styles.eyebrow}>PELADA NOVA GERAÇÃO / DIRETORIA</span><h1>O jogo começa aqui.</h1><p>Organize a pelada, convoque os jogadores e monte os times.</p><form onSubmit={submit}><label>Usuário<input autoComplete="username" value={username} onChange={e=>setUsername(e.target.value)} required /></label><label>Senha<input type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} required /></label><Notice error={error}/><button disabled={busy} className={styles.primary}>{busy?'Entrando...':'Entrar na diretoria →'}</button></form><Link className={styles.backLink} to="/">← Voltar para o site</Link></div></div>
}
Login.propTypes={onLogin:PropTypes.func.isRequired}
function Dashboard(){
  const {data:matches}=useData('/matches'),{data:players}=useData('/players')
  const confirmed=matches?.filter(item=>item.status==='confirmed').length||0
  return <><PageTitle eyebrow="PAINEL DA DIRETORIA" title="Prontos para a próxima?" description="Tudo da pelada em um só lugar."/><Link to="/admin/matches/new" className={`${styles.heroCta} ${styles.tap}`}>+ Criar nova pelada <span>↗</span></Link><div className={styles.stats}><div><strong>{players?.filter(p=>p.ativo).length??'—'}</strong><span>jogadores ativos</span></div><div><strong>{matches?.length??'—'}</strong><span>peladas salvas</span></div><div><strong>{confirmed}</strong><span>sorteios oficiais</span></div></div><h2 className={styles.sectionTitle}>Acesso rápido</h2><div className={styles.quickGrid}><Link to="/admin/history">Peladas anteriores <span>→</span></Link><Link to="/admin/players">Jogadores <span>→</span></Link><Link to="/admin/players#notas">Notas dos jogadores <span>→</span></Link><Link to="/admin/history?view=draws">Sorteios realizados <span>→</span></Link></div>{matches?.[0]&&<div className={styles.recent}><span className={styles.eyebrow}>ÚLTIMA PELADA</span><Link to={`/admin/matches/${matches[0].id}`}>{matches[0].name}<span>→</span></Link><p>{dateLabel(matches[0].date)} · {matches[0].playerCount} jogadores · {matches[0].status==='confirmed'?'Confirmada':'Em preparação'}</p></div>}</>
}
const emptyPlayer={nome:'',apelido:'',foto:'',nota:'',posicao:'',ativo:true}
function Players(){
  const {data:players,loading,error,refresh}=useData('/players')
  const {data:cards}=useRemote(playerCardsUrl)
  const [query,setQuery]=useState(''),[editing,setEditing]=useState(null),[form,setForm]=useState(emptyPlayer),[busy,setBusy]=useState(false),[message,setMessage]=useState(''),[formError,setFormError]=useState('')
  const filtered=useMemo(()=>players?.filter(p=>`${p.nome} ${p.apelido}`.toLocaleLowerCase('pt-BR').includes(query.toLocaleLowerCase('pt-BR')))||[],[players,query])
  function edit(player){setEditing(player.id);setForm({...player,nota:player.nota??'',posicao:player.posicao||''});setFormError('');window.scrollTo({top:0,behavior:'smooth'})}
  async function submit(event){event.preventDefault();setBusy(true);setFormError('');try{await adminApi(editing?`/players/${editing}`:'/players',{method:editing?'PATCH':'POST',body:{...form,nota:form.nota===''?null:Number(form.nota)}});setEditing(null);setForm(emptyPlayer);setMessage('Jogador salvo.');await refresh()}catch(e){setFormError(e.message)}finally{setBusy(false)}}
  async function toggle(player){setMessage('');try{await adminApi(`/players/${player.id}`,{method:'PATCH',body:{ativo:!player.ativo}});await refresh()}catch(e){setMessage(e.message)}}
  async function saveRating(player,nota){setMessage('');try{await adminApi(`/players/${player.id}`,{method:'PATCH',body:{nota}});await refresh({quiet:true})}catch(e){setMessage(e.message);await refresh({quiet:true})}}
  return <><PageTitle eyebrow="ELENCO" title="Jogadores" description="Cadastre posição e nota para montar times mais equilibrados."/><div id="notas" className={styles.panel}><h2>{editing?'Editar jogador':'Adicionar jogador'}</h2><form onSubmit={submit} className={styles.playerForm}><label>Nome<input value={form.nome} onChange={e=>setForm({...form,nome:e.target.value})} maxLength="80" required /></label><label>Apelido<input value={form.apelido} onChange={e=>setForm({...form,apelido:e.target.value})} maxLength="60" /></label><label>Posição<select value={form.posicao} onChange={e=>setForm({...form,posicao:e.target.value})}><option value="">Sem posição</option>{playerPositions.map(position=><option key={position} value={position}>{position}</option>)}</select></label><label>Nota (0 a 10)<input type="number" inputMode="decimal" min="0" max="10" step="0.1" value={form.nota} onChange={e=>setForm({...form,nota:e.target.value})} placeholder="Sem nota" /></label><label>Foto (URL HTTPS)<input type="url" value={form.foto} onChange={e=>setForm({...form,foto:e.target.value})} placeholder="https://..." /></label><Notice error={formError} success={message}/><div className={styles.formActions}><button disabled={busy}>{busy?'Salvando...':editing?'Salvar alterações':'Adicionar jogador'}</button>{editing&&<button type="button" className={styles.ghost} onClick={()=>{setEditing(null);setForm(emptyPlayer)}}>Cancelar</button>}</div></form></div><div className={styles.listHeader}><h2>Elenco <small>{players?.length??0}</small></h2><input type="search" placeholder="Buscar jogador" aria-label="Buscar jogador" value={query} onChange={e=>setQuery(e.target.value)} /></div><Notice error={error}/>{loading?<Busy/>:filtered.length?<div className={styles.playerList}>{filtered.map(player=><div className={`${styles.playerRow} ${!player.ativo?styles.inactive:''}`} key={player.id}><PlayerFace player={player} cards={cards||[]}/><div className={styles.playerInfo}><strong>{player.nome}</strong><small>{positionLabel(player.posicao)}{player.apelido?` · ${player.apelido}`:''}</small></div><RatingControl player={player} onSave={saveRating}/><button className={styles.smallButton} onClick={()=>edit(player)}>Editar</button><button className={styles.smallButton} onClick={()=>toggle(player)} aria-label={`${player.ativo?'Desativar':'Ativar'} ${player.nome}`}>{player.ativo?'Ativo':'Inativo'}</button></div>)}</div>:<div className={styles.empty}>Nenhum jogador encontrado.</div>}</>
}
function NewMatch(){
  const navigate=useNavigate(),now=new Date(),today=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`
  const [form,setForm]=useState({name:`Pelada — ${dateLabel(today)}`,date:today,time:'',teamCount:4,playersPerTeam:5}),[busy,setBusy]=useState(false),[error,setError]=useState('')
  async function submit(event){event.preventDefault();setBusy(true);setError('');try{const result=await adminApi('/matches',{method:'POST',body:form});navigate(`/admin/matches/${result.id}`)}catch(e){setError(e.message)}finally{setBusy(false)}}
  return <><PageTitle eyebrow="NOVA PELADA" title="Prepare o jogo" description="Defina o formato e convoque a galera na próxima etapa."/><form className={`${styles.panel} ${styles.matchForm}`} onSubmit={submit}><label>Nome da pelada<input value={form.name} maxLength="80" onChange={e=>setForm({...form,name:e.target.value})} required /></label><div className={styles.formGrid}><label>Data<input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} required /></label><label>Horário (opcional)<input type="time" value={form.time} onChange={e=>setForm({...form,time:e.target.value})} /></label></div><div className={styles.formGrid}><label>Número de times<input type="number" inputMode="numeric" min="2" max="8" value={form.teamCount} onChange={e=>setForm({...form,teamCount:e.target.value})} required /></label><label>Jogadores por time<input type="number" inputMode="numeric" min="2" max="12" value={form.playersPerTeam} onChange={e=>setForm({...form,playersPerTeam:e.target.value})} required /></label></div><Notice error={error}/><button disabled={busy} className={styles.primary}>{busy?'Criando...':'Continuar para convocação →'}</button></form></>
}
function TeamResults({match,draw,onDownload,onShare,busy,posterReady}){
  return <section className={styles.results}><div className={styles.resultHead}><div><span className={styles.eyebrow}>ESCALAÇÃO {match.status==='confirmed'?'OFICIAL':'SORTEADA'}</span><h2>Times em campo</h2></div><span className={styles.balance}>Equilíbrio: {draw.quality}</span></div><div className={styles.teamGrid}>{draw.teams.map((team,index)=><div className={styles.teamCard} key={team.id} style={{'--teamColor':['#d2ef85','#9bd4d9','#f2bb80','#d6b6ef'][index%4]}}><div className={styles.teamHead}><h3>TIME {String(index+1).padStart(2,'0')}</h3><strong>{team.average.toFixed(1)}</strong></div><ol>{team.players.map(player=><li key={player.id}><span>{player.apelido||player.nome}</span><em>{positionLabel(player.posicao)}</em></li>)}</ol><small>Média do time</small></div>)}</div>{draw.reserves.length>0&&<div className={styles.reserves}><strong>Reservas</strong><span>{draw.reserves.map(player=>player.apelido||player.nome).join(' · ')}</span></div>}<div className={styles.balancePanel}><strong>Diferença entre os times</strong><span>{draw.balanceDifference.toFixed(2)}</span><div>{draw.teams.map((team,index)=><p key={team.id}>Time {String(index+1).padStart(2,'0')} <b>{team.average.toFixed(1)}</b></p>)}</div></div>{match.status==='confirmed'&&<div className={styles.shareActions}><button onClick={onDownload} disabled={busy}>{posterReady?'↓ Baixar escalação':'Preparando imagem...'}</button>{typeof navigator.share==='function'&&<button className={styles.secondary} onClick={onShare} disabled={busy||!posterReady}>Compartilhar</button>}</div>}</section>
}
TeamResults.propTypes={match:PropTypes.shape({status:PropTypes.string.isRequired}).isRequired,draw:PropTypes.shape({quality:PropTypes.string.isRequired,teams:PropTypes.array.isRequired,reserves:PropTypes.array.isRequired,balanceDifference:PropTypes.number.isRequired}).isRequired,onDownload:PropTypes.func.isRequired,onShare:PropTypes.func.isRequired,busy:PropTypes.bool.isRequired,posterReady:PropTypes.bool.isRequired}
function Match(){
  const {id}=useParams(),{data:match,loading,error,refresh,setData:setMatch}=useData(`/matches/${id}`),{data:players}=useData('/players'),{data:cards}=useRemote(playerCardsUrl)
  const [selected,setSelected]=useState([]),[search,setSearch]=useState(''),[reserveMode,setReserveMode]=useState('random'),[reserveIds,setReserveIds]=useState([]),[busy,setBusy]=useState(false),[actionError,setActionError]=useState(''),[message,setMessage]=useState(''),[activeDrawId,setActiveDrawId]=useState(null),[posterBlob,setPosterBlob]=useState(null)
  useEffect(()=>{if(match){setSelected(match.selectedIds);setActiveDrawId(match.officialDrawId||match.draws.at(-1)?.id||null)}},[match])
  const activePlayers=players?.filter(player=>player.ativo)||[]
  const filtered=activePlayers.filter(player=>`${player.nome} ${player.apelido}`.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR')))
  const slots=match?match.teamCount*match.playersPerTeam:0,extras=selected.length-slots
  const currentDraw=match?.draws.find(draw=>draw.id===activeDrawId)||match?.draws.at(-1)
  useEffect(()=>{if(match?.status!=='confirmed'||!currentDraw)return;let current=true;createPoster(match,currentDraw).then(blob=>{if(current)setPosterBlob(blob)}).catch(error=>{if(current)setActionError(error.message)});return()=>{current=false}},[match,currentDraw])
  const missingRating=selected.filter(playerId=>players?.find(player=>player.id===playerId)?.nota===null).length
  const [selectionBusy,setSelectionBusy]=useState(false)
  const saveQueue=useRef(Promise.resolve()),selectionRevision=useRef(0)
  function changeSelection(ids){
    setSelected(ids);setMatch(previous=>previous?{...previous,selectedIds:ids,draws:[]}:previous);setActiveDrawId(null)
    setActionError('');setMessage('Salvando presença...');setSelectionBusy(true)
    const revision=++selectionRevision.current
    const operation=saveQueue.current.catch(()=>{}).then(()=>adminApi(`/matches/${id}`,{method:'PATCH',body:{selectedIds:ids}}))
    saveQueue.current=operation
    operation.then(()=>{if(revision===selectionRevision.current){setMessage('Presença salva.');setSelectionBusy(false)}}).catch(async error=>{if(revision===selectionRevision.current){setActionError(error.message);setMessage('');setSelectionBusy(false);await refresh()}})
  }
  async function draw(){setBusy(true);setActionError('');setMessage('');try{await adminApi(`/matches/${id}/draw`,{method:'POST',body:{reserveMode, reserveIds}});await refresh();setMessage('Novo sorteio pronto.')}catch(e){setActionError(e.message)}finally{setBusy(false)}}
  async function confirm(){setBusy(true);setActionError('');try{await adminApi(`/matches/${id}/confirm`,{method:'POST',body:{drawId:currentDraw.id}});await refresh();setMessage('Escalação confirmada! A imagem está pronta para baixar.')}catch(e){setActionError(e.message)}finally{setBusy(false)}}
  async function poster(share){setBusy(true);setActionError('');try{const blob=posterBlob||await createPoster(match,currentDraw),filename=posterFilename(match);if(share&&navigator.canShare?.({files:[new File([blob],filename,{type:'image/png'})]})){await navigator.share({files:[new File([blob],filename,{type:'image/png'})],title:match.name})}else{downloadPoster(blob,filename);if(share)setMessage('Compartilhamento indisponível neste aparelho. Imagem baixada.')}}catch(e){if(e.name!=='AbortError')setActionError(e.message)}finally{setBusy(false)}}
  if(loading&&!match)return <Busy/>
  if(!match)return <Notice error={error||'Pelada não encontrada.'}/>
  const confirmed=match.status==='confirmed'
  return <><PageTitle eyebrow={confirmed?'PELADA CONFIRMADA':'CONVOCAÇÃO'} title={match.name} description={`${dateLabel(match.date)}${match.time?` às ${match.time}`:''} · ${match.teamCount} times · ${match.playersPerTeam} por time`} action={<Link className={styles.textLink} to="/admin/history">Histórico →</Link>}/><div className={styles.selectionStats}><strong>{selected.length} jogadores selecionados</strong><span>{slots} vagas em campo{extras>0?` · ${extras} reserva${extras>1?'s':''}`:''}</span></div>{!confirmed&&<section className={styles.selection}><div className={styles.selectTools}><input type="search" placeholder="Buscar jogador" aria-label="Buscar jogador" value={search} onChange={e=>setSearch(e.target.value)}/><button className={styles.ghost} onClick={()=>changeSelection(activePlayers.map(player=>player.id))}>Selecionar todos</button></div><div className={styles.convocation}>{filtered.map(player=><label className={`${styles.convocationRow} ${selected.includes(player.id)?styles.selected:''}`} key={player.id}><input type="checkbox" checked={selected.includes(player.id)} onChange={()=>changeSelection(selected.includes(player.id)?selected.filter(id=>id!==player.id):[...selected,player.id])}/><PlayerFace player={player} cards={cards||[]}/><span><strong>{player.nome}</strong><small>{positionLabel(player.posicao)} · {player.nota===null?'Sem nota':`Nota ${player.nota}`}</small></span><span className={styles.checkVisual} aria-hidden="true">✓</span></label>)}</div>{filtered.length===0&&<div className={styles.empty}>Nenhum jogador encontrado.</div>}</section>}{!confirmed&&<div className={styles.drawPanel}><h2>Sortear times</h2><p>As posições serão distribuídas o mais igualmente possível entre os times.</p>{selected.length===0?<p>Selecione os jogadores presentes acima.</p>:selected.length<slots?<p>Você selecionou {selected.length} jogadores para {match.teamCount} times de {match.playersPerTeam}. Faltam {slots-selected.length}.</p>:<><p>{extras>0?`${extras} jogador${extras>1?'es ficarão':' ficará'} como reserva.`:'Todos os selecionados entram em campo.'}</p>{extras>0&&<><div className={styles.modeChoices}><label><input type="radio" name="reserveMode" checked={reserveMode==='random'} onChange={()=>setReserveMode('random')}/> Reservas aleatórios</label><label><input type="radio" name="reserveMode" checked={reserveMode==='manual'} onChange={()=>setReserveMode('manual')}/> Escolher reservas</label></div>{reserveMode==='manual'&&<div className={styles.reserveChoices}>{selected.map(playerId=>players?.find(player=>player.id===playerId)).filter(Boolean).map(player=><label key={player.id}><input type="checkbox" checked={reserveIds.includes(player.id)} onChange={()=>setReserveIds(reserveIds.includes(player.id)?reserveIds.filter(id=>id!==player.id):[...reserveIds,player.id])}/>{player.nome}</label>)}<small>{reserveIds.length} de {extras} reservas escolhidos</small></div>}</>}{missingRating>0&&<p className={styles.warning}>{missingRating} selecionado(s) sem nota. Preencha as notas em <Link to="/admin/players#notas">Jogadores</Link> antes de sortear.</p>}</>}<Notice error={actionError} success={message}/><button className={styles.primary} disabled={busy||selectionBusy||selected.length<slots||(reserveMode==='manual'&&extras>0&&reserveIds.length!==extras)} onClick={draw}>{busy?'Preparando sorteio...':currentDraw?'↻ Sortear novamente':'Sortear times →'}</button></div>}{currentDraw&&<><TeamResults match={match} draw={currentDraw} onDownload={()=>poster(false)} onShare={()=>poster(true)} busy={busy} posterReady={!!posterBlob}/>{!confirmed&&<div className={styles.confirmBar}><span>Sorteio #{match.draws.length} · diferença {currentDraw.balanceDifference.toFixed(2)}</span><button disabled={busy} onClick={confirm}>Confirmar escalação</button></div>}</>}</>
}
function History(){
  const {data:matches,loading,error}=useData('/matches')
  const showDraws=new URLSearchParams(window.location.search).get('view')==='draws'
  const items=showDraws?matches?.filter(item=>item.drawCount>0):matches
  return <><PageTitle eyebrow="ARQUIVO DA DIRETORIA" title={showDraws?'Sorteios realizados':'Peladas anteriores'} description="Abra uma pelada para consultar os times ou baixar a arte novamente." action={<Link className={styles.textLink} to="/admin/matches/new">+ Nova pelada</Link>}/><Notice error={error}/>{loading?<Busy/>:items?.length?<div className={styles.historyList}>{items.map(match=><Link to={`/admin/matches/${match.id}`} className={styles.historyCard} key={match.id}><div><small>{dateLabel(match.date)}</small><h2>{match.name}</h2><p>{match.playerCount} jogadores · {match.teamCount} times · {match.drawCount} sorteio(s)</p></div><span className={match.status==='confirmed'?styles.confirmed:styles.draft}>{match.status==='confirmed'?'Confirmada':'Em preparação'}</span><b>→</b></Link>)}</div>:<div className={styles.empty}>Nenhuma pelada registrada ainda. <Link to="/admin/matches/new">Criar a primeira →</Link></div>}</>
}
export default function Admin(){
  const [auth,setAuth]=useState(null)
  const [logoutError,setLogoutError]=useState('')
  useEffect(()=>{adminApi('/session').then(()=>setAuth(true)).catch(()=>setAuth(false))},[])
  useEffect(()=>{const expired=()=>setAuth(false);window.addEventListener('png-admin-unauthorized',expired);return()=>window.removeEventListener('png-admin-unauthorized',expired)},[])
  async function login(username,password){await adminApi('/login',{method:'POST',body:{username,password}});setAuth(true)}
  async function logout(){setLogoutError('');try{await adminApi('/logout',{method:'POST'});setAuth(false)}catch(error){setLogoutError(error.message)}}
  if(auth===null)return <div className={styles.admin}><Busy>Verificando acesso...</Busy></div>
  if(!auth)return <Login onLogin={login}/>
  return <ProtectedShell onLogout={logout} logoutError={logoutError}><Routes><Route index element={<Dashboard/>}/><Route path="players" element={<Players/>}/><Route path="matches/new" element={<NewMatch/>}/><Route path="matches/:id" element={<Match/>}/><Route path="history" element={<History/>}/><Route path="*" element={<Navigate to="/admin" replace/>}/></Routes></ProtectedShell>
}
