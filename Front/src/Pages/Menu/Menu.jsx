import Logo from '../../assets/logoPNG.png'
import Ronaldinho from '../../assets/ronaldinho.jpg'
import Neymar from '../../assets/neymar.jpg'
import Palmer from '../../assets/cold.jpg'
import Galaticos from '../../assets/galaticos.jpg'
import MSN from '../../assets/ney.jpg'
import Galo from '../../assets/galoXmaria.jpg'
import Lionel from '../../assets/lionel.jpg'
import styles from './Menu.module.css'
import Goats from '../../assets/goats.jpg'
import Romario from '../../assets/romario.jpg'
import React from 'react'
import { Link } from 'react-router-dom'

function Menu(){
    return(
        <>
            <div className={styles.topBar}>
                <img src={Logo}/>
            </div>
            <div className={styles.header}>
                <div className={styles.caixaTxt}>
                    <h2>FALA, JOGADOR!</h2>
                    <p>Seja Bem-Vindo a Pelada Nova Geração.</p> <br />
                    <p>Aqui você vai ficar por dentro de tudo que acontece na melhor pelada do Jara!</p>
                </div>
                
            </div>

            
            <div className={styles.containerMenu}>
                <div className={styles.menuBox}> 
                    <Link to='/totw'><img src={Ronaldinho}/></Link>
                    <div className={styles.imgBox}>
                        <p>Seleção da semana</p>
                    </div>
                </div>
                <div className={styles.menuBox}>
                <Link to='/estatisticas'><img src={Romario}/></Link>
                    <div className={styles.imgBox}>
                        <p>Estatisticas</p>
                    </div>
                </div>
                <div className={styles.menuBox}>
                    <Link to='/eventos'><img src={Neymar}/></Link>
                    <div className={styles.imgBox}>
                        <p>Eventos</p>
                    </div>
                </div>
                <div className={styles.menuBox}>
                    <Link to='/playoff'><img src={Lionel}/></Link>
                    <div className={styles.imgBox}>
                        <p>Play-offs</p>
                    </div>
                </div>
                <div className={styles.menuBox}>
                    <Link to='/classico'><img src={Galo}/></Link>
                    <div className={styles.imgBox}>
                        <p>Classico</p>
                    </div>
                </div>
                <div className={styles.menuBox}>
                    <Link to='/regulamento'><img src={Palmer}/></Link>
                    <div className={styles.imgBox}>
                        <p>Regulamento</p>
                    </div>
                </div>
                <div className={styles.menuBox}>
                    <Link to='/sobre'><img src={Goats}/></Link>
                    <div className={styles.imgBox}>
                        <p>Sobre Nós</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Menu