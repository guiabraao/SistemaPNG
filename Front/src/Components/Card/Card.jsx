import styles from './Card.module.css'
import CardTOTW from '../../assets/cardTOTW.webp'
import perfil from '../../assets/perfil.png'
import Logo from '../../assets/logoPNG.png'
import Flag from '../../assets/bandeira.jpg'

function Card (){



    return (
        <>
            <div className={styles.containerCard}>
                <img src={CardTOTW} alt="Moldura original do card"/>

                <div className={styles.cardBox}>

                    <div className={styles.containerCardBox}>

                        <div className={styles.headerBox}>

                            <div className={styles.cardLeftTop}>
                                <p>80</p>
                                <p>ATA</p>
                            </div>
                            <div className={styles.cardrightTop}>
                                <img src={perfil} alt="Migalha"/>
                            </div>
                        </div>

                        <div className={styles.bottomCard}>
                            <div className={styles.topBottom}>
                                <p>Migalha</p>
                            </div>
                            <div className={styles.footerBottom}>
                                <img src={Logo} alt="PNG" />
                                <img src={Flag} alt="Brasil" />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Card
