import styles from '../../styles/Pages.module.css'
import KDB from '../../assets/kdb.jpg'
import Rayo from '../../assets/raio.jpg'
import Header from '../../Components/Header/Header'
import back from '../../assets/backbtn.svg'
import { Link } from 'react-router-dom'


function Estatisticas() {
    return (
        <>
            <Header />
            <div className={styles.topEst}>
                <Link to='/menu'><img src={back} alt="Voltar" /></Link>
            </div>
            <div className={styles.containerEst}>
                <h2>Estatisticas</h2>
                <div className={styles.menuBox}>
                    <Link to='/artilhariaGeral' aria-label='Gols'><img src={Rayo} alt="" loading="lazy" /></Link>
                    <div className={styles.imgBox}>
                        <p>Gols</p>
                    </div>
                </div>
                <div className={styles.menuBox}>
                    <Link to='/assistenciaGeral' aria-label='Assistencias'><img src={KDB} alt="" loading="lazy" /></Link>
                    <div className={styles.imgBox}>
                        <p>Assistencias</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Estatisticas
