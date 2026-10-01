import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import gsap from 'gsap'
import Header from '../../Components/Header/Header'
import Icon from '../../Components/Icon'
import PlayerPortrait from '../../Components/PlayerPortrait'
import useRemote from '../../hooks/useRemote'
import { CURRENT_SEASON, YEARS, statistics, playerCardsUrl, playerImage, rankPlayers } from '../../data/seasons'
import YearSelector from '../../Components/YearSelector'
import styles from './Ranking.module.css'

const copy = {
  goals: { title: 'Artilharia', eyebrow: 'QUEM FAZ A REDE BALANÇAR', description: 'A disputa se decide a cada gol.', badge: 'ARTILHEIRO DA TEMPORADA', total: 'Gols na temporada', stat: 'GOLS', verb: 'Marcaram gols', leaderboard: 'Na corrida pelo topo', leader: 'Líder da artilharia' },
  assists: { title: 'Assistências', eyebrow: 'QUEM CONSTRÓI CADA JOGADA', description: 'O último passe também faz a diferença.', badge: 'LÍDER EM ASSISTÊNCIAS', total: 'Assistências na temporada', stat: 'ASSISTÊNCIAS', verb: 'Deram assistências', leaderboard: 'Os nomes por trás dos gols', leader: 'Líder em assistências' },
}
function readSeason(type) {
  try {
    const saved = Number(sessionStorage.getItem(`png-season-${type}`))
    return YEARS.includes(saved) ? saved : CURRENT_SEASON
  } catch { return CURRENT_SEASON }
}
export default function Ranking({ type }) {
  const labels = copy[type]
  const [selected, setSelected] = useState(() => readSeason(type))
  const [displayed, setDisplayed] = useState(() => readSeason(type))
  const [search, setSearch] = useState('')
  const root = useRef(null)
  const content = useRef(null)
  const animation = useRef(null)
  const outgoing = useRef(null)
  const { data, status, retry } = useRemote(statistics[type][displayed].url)
  const { data: cards } = useRemote(playerCardsUrl)
  const ranked = useMemo(() => rankPlayers(data, type), [data, type])
  const players = ranked.filter(player => player.nome.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR')))
  const leader = ranked[0]
  const total = ranked.reduce((sum, player) => sum + player.value, 0)
  useLayoutEffect(() => {
    animation.current = gsap.context(() => {}, root)
    return () => { outgoing.current?.kill(); animation.current.revert() }
  }, [])
  useLayoutEffect(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(content.current, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .25, clearProps: 'all' })
      const rows = [...content.current.querySelectorAll('[data-rank]')].slice(0, 10)
      if (rows.length) gsap.from(rows, { autoAlpha: 0, y: 16, duration: .3, stagger: { amount: .16 }, clearProps: 'all' })
    }, root)
    return () => media.revert()
  }, [displayed, status])
  useEffect(() => { setSearch('') }, [displayed])
  useEffect(() => {
    try { sessionStorage.setItem(`png-season-${type}`, String(selected)) } catch { /* Storage may be disabled. */ }
  }, [selected, type])
  function changeSeason(year) {
    if (year === selected) return
    setSelected(year)
    outgoing.current?.kill()
    if (year === displayed) {
      animation.current.add(() => gsap.to(content.current, { autoAlpha: 1, y: 0, duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : .2, clearProps: 'all' }))
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setDisplayed(year); return }
    animation.current.add(() => {
      outgoing.current = gsap.to(content.current, { autoAlpha: 0, y: -6, duration: .12, overwrite: true, onComplete: () => setDisplayed(year) })
    })
  }
  function portrait(player, featured = false) {
    const src = playerImage(player, cards)
    return <PlayerPortrait src={src} name={player.nome} imageClass={featured ? styles.leaderImage : styles.avatar} fallbackClass={featured ? styles.leaderInitial : styles.initial} featured={featured} />
  }
  return <div ref={root}>
    <Header />
    <Link to="/estatisticas" className={styles.back}>← Estatísticas</Link>
    <div className={styles.heading}><div><span className="eyebrow">{labels.eyebrow}</span><h1>{labels.title}<span>.</span></h1><p>{labels.description}</p></div><Icon name="trophy" /></div>
    <div className={styles.toolbar}><YearSelector activeYear={selected} onChange={changeSeason} label={`Temporada de ${labels.title.toLowerCase()}`} /><span className={styles.seasonLabel}>{statistics[type][selected].label}</span></div>
    <div ref={content} aria-busy={status === 'loading'}>
      {status === 'loading' && <div className="status-panel" role="status">Buscando os números da temporada…</div>}
      {status === 'error' && <div className="status-panel" role="alert"><strong>O placar não carregou.</strong><p>Confira sua conexão e tente novamente.</p><button onClick={retry}>Tentar novamente</button></div>}
      {status === 'ready' && !leader && <div className="status-panel" role="status">Nenhum jogador registrado nesta temporada.</div>}
      {status === 'ready' && leader && <>
        <section className={styles.leader} aria-label={`Líder de ${labels.title.toLowerCase()}`}><div className={styles.leaderInfo}><span className={styles.leaderBadge}><Icon name="trophy"/> {ranked.filter(p => p.position === 1).length > 1 ? 'NA LIDERANÇA' : labels.badge}</span><span className={styles.leaderRank}>01</span><h2>{leader.nome}</h2><div className={styles.leaderStat}><strong>{leader.value}</strong><span>{labels.stat}<br />EM {displayed}</span></div></div>{portrait(leader,true)}<span className={styles.fieldMark} aria-hidden="true"/></section>
        <div className={styles.summary}><div><strong>{total}</strong><span>{labels.total}</span></div><div><strong>{ranked.length}</strong><span>Jogadores no ranking</span></div><div><strong>{ranked.filter(p => p.value > 0).length}</strong><span>{labels.verb}</span></div></div>
        <div className="section-heading"><h2>{labels.leaderboard}</h2><span className={styles.count}>{displayed} / PNG</span></div>
        <label className={styles.search}><Icon name="search"/><input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar jogador" aria-label={`Buscar jogador em ${labels.title.toLowerCase()}`}/></label>
        <div className={styles.ranking}><div className={styles.listHeading}><span>POS. / JOGADOR</span><span>{labels.stat}</span></div><ol>{players.map(player => <li key={player.id} data-rank className={player.position <= 3 ? styles.podium : undefined}><span className={styles.position}>{String(player.position).padStart(2,'0')}</span>{portrait(player)}<div className={styles.playerName}><strong>{player.nome}</strong><span>{player.position === 1 ? labels.leader : `Temporada ${displayed}`}</span></div><strong className={styles.goals}>{player.value}</strong></li>)}</ol>{players.length === 0 && <p className="status-panel">Nenhum jogador encontrado.</p>}</div>
        <p className={styles.note}>Classificação por {labels.stat.toLowerCase()} · Jogadores empatados compartilham a posição.</p>
      </>}
    </div>
  </div>
}

Ranking.propTypes = { type: PropTypes.oneOf(['goals', 'assists']).isRequired }
