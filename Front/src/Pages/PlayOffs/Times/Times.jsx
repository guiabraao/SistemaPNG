import styles from '../../../styles/Pages.module.css'
import Roberto from '../../../assets/roberto.jpg'
import Ronaldinho from '../../../assets/champ.jpg'
import Big3 from '../../../assets/big3.jpg'
import Header from '../../../Components/Header/Header'
import back from '../../../assets/backbtn.svg'
import { Link } from 'react-router-dom'

function Times() {
    return (
        <>
            <Header />

            <div className={styles.topEst}>
                <Link to='/playoff'><img src={back} alt="Voltar" /></Link>
            </div>

            <h2>Times Play-Offs</h2>

            <div className={styles.containerMenu}>
                <div className={styles.menuBox}>
                    <Link to='/playoffTime1' aria-label='Time 1'><img src={Ronaldinho} alt="" loading="lazy" /></Link>
                    <div className={styles.imgBox}>
                        <p>Time 1</p>
                    </div>
                </div>
                <div className={styles.menuBox}>
                    <Link to='/playoffTime2' aria-label='Time 2'><img src={Roberto} alt="" loading="lazy" /></Link>
                    <div className={styles.imgBox}>
                        <p>Time 2</p>
                    </div>
                </div>
                <div className={styles.menuBox}>
                    <Link to='/playoffTime3' aria-label='Time 3'><img src={Big3} alt="" loading="lazy" /></Link>
                    <div className={styles.imgBox}>
                        <p>Time 3</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Times
