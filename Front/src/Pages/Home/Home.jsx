import { Link } from 'react-router-dom'
import Header from '../../Components/Header/Header'
import Icon from '../../Components/Icon'
import styles from './Home.module.css'
import Fenomeno from '../../assets/fenomeno.jpg'
import Ronaldinho from '../../assets/ronaldinho.jpg'
import Romario from '../../assets/romario.jpg'
import Neymar from '../../assets/neymar.jpg'
export default function Home() {
  return <>
    <Header />
    <section className={styles.hero}>
      <img src={Fenomeno} alt="Ronaldo em campo" className={styles.heroImage} />
      <div className={styles.heroContent} data-animate>
        <span className={styles.kicker}><span /> FUTEBOL. RESENHA. PNG.</span>
        <h1>O NOSSO<br />JOGO.<br /><em>A NOSSA<br className={styles.mobileBreak} /> HISTÓRIA.</em></h1>
        <p>Dentro de campo, competição.<br />Fora dele, uma nova geração de amigos.</p>
        <Link to="/menu" className={styles.cta}>Entrar na pelada <Icon name="arrow" /></Link>
      </div>
      <div className={styles.heroFoot}><span>PELADA NOVA GERAÇÃO</span><span>EST. JARA ↗</span></div>
    </section>
    <div className={styles.matchday} data-animate><div className={styles.date}><span>TODO</span><strong>SÁB</strong></div><div><span className="eyebrow">NOSSO ENCONTRO</span><h3>Sábado é dia de PNG.</h3><p>13h · Jara · A resenha está garantida</p></div><Icon name="calendar" /></div>
    <div className="section-heading"><h2>Dentro das quatro linhas</h2><Link to="/menu">Explorar <Icon name="arrow" /></Link></div>
    <section className={styles.quickGrid}>
      {[['/artilhariaGeral','Artilharia','Cada gol conta.',Romario],['/totw','Seleção da semana','Os destaques da rodada.',Ronaldinho],['/eventos','Eventos','Além do apito final.',Neymar]].map(([to,title,text,image]) => <Link key={to} to={to} className={styles.quickCard} data-animate><img src={image} alt="" loading="lazy"/><div><h3>{title}</h3><p>{text}</p></div><Icon name="arrow"/></Link>)}
    </section>
  </>
}
