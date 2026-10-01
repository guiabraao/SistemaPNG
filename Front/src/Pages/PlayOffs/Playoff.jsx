import styles from '../../styles/Pages.module.css'
import Header from '../../Components/Header/Header'
import Cris from '../../assets/cris.jpg'
import Cruyff from '../../assets/cruyff.jpg'
import Kaka from '../../assets/kaka.jpg'
import Zizu from '../../assets/zidane.jpg'
import Maradona from '../../assets/maradona.jpg'
import Pele from '../../assets/pele.jpg'
import Duo from '../../assets/duo.jpg'
import back from '../../assets/backbtn.svg'
import { Link } from 'react-router-dom'



function Playoff() {
    return (
        <>
            <Header />
            <div className={styles.topEst}>
                <Link to='/menu'><img src={back} alt="Voltar" /></Link>
            </div>
            <h2>Play-Offs</h2>
            <div className={styles.containerMenu}>
                <div className={styles.menuBox}>
                    <Link to='/playoffClassifi' aria-label='Classificação'><img src={Cris} alt="" loading="lazy" /></Link>
                    <div className={styles.imgBox}>
                        <p>Classificação</p>
                    </div>
                </div>
                <div className={styles.menuBox}>
                    <Link to='/playoffFinal' aria-label='Final'><img src={Duo} alt="" loading="lazy" /></Link>
                    <div className={styles.imgBox}>
                        <p>Final</p>
                    </div>
                </div>
                <div className={styles.menuBox}>
                    <Link to='/playoffGols' aria-label='Gols'><img src={Maradona} alt="" loading="lazy" /></Link>
                    <div className={styles.imgBox}>
                        <p>Gols</p>
                    </div>
                </div>
                <div className={styles.menuBox}>
                    <Link to='/playoffAssist' aria-label='Assistencias'><img src={Zizu} alt="" loading="lazy" /></Link>
                    <div className={styles.imgBox}>
                        <p>Assistencias</p>
                    </div>
                </div>
                <div className={styles.menuBox}>
                    <Link to='/playoffPremiacao' aria-label='Premiação'><img src={Kaka} alt="" loading="lazy" /></Link>
                    <div className={styles.imgBox}>
                        <p>Premiação</p>
                    </div>
                </div>
                <div className={styles.menuBox}>
                    <Link to='/playoffTimes' aria-label='Times'><img src={Pele} alt="" loading="lazy" /></Link>
                    <div className={styles.imgBox}>
                        <p>Times</p>
                    </div>
                </div>
                <div className={styles.menuBox}>
                    <Link to='/playoffSelecao' aria-label='Seleção'><img src={Cruyff} alt="" loading="lazy" /></Link>
                    <div className={styles.imgBox}>
                        <p>Seleção</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Playoff
