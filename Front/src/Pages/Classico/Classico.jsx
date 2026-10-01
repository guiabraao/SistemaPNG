import styles from '../../styles/Pages.module.css'
import Ronaldinho from '../../assets/ronaldinhoGalo.jpg'
import gabiGol from '../../assets/gabibolCruzeiro.jpg'
import Header from '../../Components/Header/Header'
import back from '../../assets/backbtn.svg'
import { Link } from 'react-router-dom'

function Classico() {
    return (
        <>
            <Header />

            <div className={styles.topEst}>
                <Link to='/menu'><img src={back} alt="Voltar" /></Link>
            </div>

            <h2>Clássico</h2>

            <div className={styles.containerMenu}>
                <div className={styles.menuBox}>
                    <Link to='/classicoGalo' aria-label='Galo'><img src={Ronaldinho} alt="" loading="lazy" /></Link>
                    <div className={styles.imgBox}>
                        <p>Galo</p>
                    </div>
                </div>
                <div className={styles.menuBox}>
                    <Link to='/classicoCruzeiro' aria-label='Cruzeiro'><img src={gabiGol} alt="" loading="lazy" /></Link>
                    <div className={styles.imgBox}>
                        <p>Cruzeiro</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Classico
