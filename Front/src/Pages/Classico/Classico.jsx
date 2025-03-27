import styles from './Cassico.module.css'
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
                <Link to='/menu'><img src={back} /></Link>
            </div>

            <h2>Classico</h2>

            <div className={styles.containerMenu}>
                <div className={styles.menuBox}>
                    <Link to='/classicoGalo'><img src={Ronaldinho} /></Link>
                    <div className={styles.imgBox}>
                        <p>Galo</p>
                    </div>
                </div>
                <div className={styles.menuBox}>
                    <Link to='/classicoCruzeiro'><img src={gabiGol} /></Link>
                    <div className={styles.imgBox}>
                        <p>Cruzeiro</p>
                    </div>
                </div>
                <div className={styles.menuBox}>
                    {/* <img src={} /> */}
                    <div className={styles.imgBox}>
                        <p>Seleção da semana</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Classico