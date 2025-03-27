import styles from './Times.module.css'
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
                <Link to='/playoff'><img src={back} /></Link>
            </div>

            <h2>Times Play-Offs</h2>

            <div className={styles.containerMenu}>
                <div className={styles.menuBox}>
                    <Link to='/playoffTime1'><img src={Ronaldinho} /></Link>
                    <div className={styles.imgBox}>
                        <p>Time 1</p>
                    </div>
                </div>
                <div className={styles.menuBox}>
                    <Link to='/playoffTime2'><img src={Roberto} /></Link>
                    <div className={styles.imgBox}>
                        <p>Time 2</p>
                    </div>
                </div>
                <div className={styles.menuBox}>
                    <Link to='/playoffTime3'><img src={Big3} /></Link>
                    <div className={styles.imgBox}>
                        <p>Time 3</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Times