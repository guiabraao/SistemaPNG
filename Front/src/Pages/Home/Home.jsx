import Instagram from '../../assets/instagram.svg'
import Logo from '../../assets/logoPNG.png'
import styles from './Home.module.css'
import Fenomeno from '../../assets/fenomeno.jpg'
import { Link , useNavigate} from "react-router-dom"



function Home() {

    const navigate = useNavigate()
    

    return (

        <>
            <div className={styles.main}></div>
            <div className={styles.containerHome}>
                <div className={styles.containerHomeTop}>
                    <img src={Logo} />
                </div>
                <div className={styles.containerBottom}>
                    <div className={styles.containerBottomBox}>
                        <h3>Fala, Jogador!</h3>
                        <p>Entre e fique por <br /> dentro de tudo sobre <br /> a PNG!</p>
                    </div>
                    <div className={styles.btnEntrar}>
                        <div className={styles.menuBox}>
                            <Link to='/menu'><img src={Fenomeno} /></Link>
                            <div className={styles.imgBox}>
                                <p>Entrar</p>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>


        </>
    )
}

export default Home