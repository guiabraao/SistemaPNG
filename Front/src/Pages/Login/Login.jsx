import { useState } from "react"
import styles from './Login.module.css'
import Logo from '../../assets/logoPNG.png'
import btn from '../../assets/kickMatch.svg'

function Login(){

    return(
        <>
            <main>
                <div className={styles.headerLogin}>
                    <img src={Logo} />
                </div>
                <div className={styles.container}>
                    <form>
                        <div className={styles.inputBox}>
                            <input type="text" placeholder="Usuário" name="usuario"/>
                            <span></span>
                        </div>
                        <div className={styles.inputBox}>
                            <input type="text" placeholder="Senha" name="senha"/>
                            <span></span>
                        </div>   
                        <button><img src={btn}/></button>                     
                    </form>
                </div>
            </main>
        </>
    )

}

export default Login