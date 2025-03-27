import styles from './Regulamento.module.css'
import back from '../../assets/backbtn.svg'
import Logo from '../../assets/logoPNG.png'
import Header from '../../Components/Header/Header'
import { Link } from 'react-router-dom'

function Regulamento(){
    return(
        <>
            <Header/>
            
            <div className={styles.topEst}>
                <Link to='/menu'><img src={back}/></Link>
            </div>
            
            <h2>Regulamento</h2>


            <div className={styles.containerReg}>
                <div className={styles.boxReg}>
                    <p>⚠️ ATENÇÃO ⚠️ </p> <br />
                    <p>     - Chegar no horário marcado! Estar lá 13:00 SEM ATRASO.</p> <br />
                    <p>     - Jogar SEMPRE com o uniforme da pelada.(meião e short preto +colete)</p> <br />
                    <p>     - Respeitar todos. Inclusive o juiz e as pessoas que fazem o favor de completar nossa pelada.</p> <br />
                    <p>     - A lista fecha toda quinta-feira. Porque precisamos passar a relação de quem vai jogar para o Jara e combinar com o juiz.</p> <br />
                    <p>     - Para facilitar a organização, se você não quer participar da pelada, saia do grupo</p> <br />
                    <p>     - QUEM NÃO TIVER O COLETE, RESOLVER COM A DIRETORIA.</p> <br />
                    <p>     PIX: peladanovageracao@gmail.com</p>
                </div>
            </div>
        </>
    )
}

export default Regulamento