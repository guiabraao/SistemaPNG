import { Link } from 'react-router-dom'
import styles from './Header.module.css'
import Logo from '../../assets/logoPNG.png'
export default function Header() {
  return <header className={styles.topBar}>
    <Link to="/" className={styles.brand} aria-label="PNG — início"><img src={Logo} alt="Pelada Nova Geração" /><span>PNG<span>PELADA NOVA GERAÇÃO</span></span></Link>
    <Link to="/menu" className={styles.explore}>Nossa pelada <span>↗</span></Link>
  </header>
}
