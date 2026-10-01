import Header from '../../Components/Header/Header'
import Icon from '../../Components/Icon'
import { Link } from 'react-router-dom'
import styles from './Menu.module.css'
import Ronaldinho from '../../assets/ronaldinho.jpg'
import Neymar from '../../assets/neymar.jpg'
import Palmer from '../../assets/cold.jpg'
import Galo from '../../assets/galoXmaria.jpg'
import Lionel from '../../assets/lionel.jpg'
import Goats from '../../assets/goats.jpg'
import Romario from '../../assets/romario.jpg'
const sections = [
  ['/totw','Seleção da semana','Os craques da rodada',Ronaldinho],
  ['/estatisticas','Estatísticas','Gols e assistências',Romario],
  ['/eventos','Eventos','Nossa agenda fora de campo',Neymar],
  ['/playoff','Play-offs','A disputa pelo título',Lionel],
  ['/classico','Clássico','Rivalidade dentro de campo',Galo],
  ['/regulamento','Regulamento','As regras da nossa pelada',Palmer],
  ['/sobre','Sobre nós','Futebol, amizade e tradição',Goats],
]
export default function Menu() {
  return <><Header /><section className={styles.heading}><span className="eyebrow">O PONTO DE ENCONTRO DA PNG</span><h1>Fala, jogador<span>!</span></h1><p>Tudo da nossa pelada. Dentro e fora de campo.</p></section>
    <div className="section-heading"><h2>Explore o jogo</h2><span className={styles.caption}>NOSSA COMUNIDADE</span></div>
    <section className={styles.grid}>{sections.map(([to,title,text,image],i) => <Link to={to} key={to} className={styles.menuBox} data-animate><img src={image} alt="" loading={i > 1 ? 'lazy' : 'eager'} /><div className={styles.info}><span className={styles.number}>0{i+1}</span><h2>{title}</h2><p>{text}</p><Icon name="arrow"/></div></Link>)}</section>
  </>
}
