import Header from "../../Components/Header/Header";
import styles from '../../styles/Pages.module.css'
import Selecao from '../../assets/selecao.jpeg'
import back from '../../assets/backbtn.svg'
import { Link } from 'react-router-dom'

function Sobre(){
    return(
        <>
            <Header />
            <div className={styles.topEst}>
                <Link to='/menu'><img src={back} alt="Voltar" /></Link>
            </div>
            <h2>Sobre Nós</h2>

            <div className={styles.containerSobre}>
                <div className={styles.sobreBox}>
                    <p>A Pelada Nova Geração (PNG) não é apenas um jogo de futebol, é uma tradição! Todos os sábados, às 13h, no Jara, a bola rola com muita resenha, jogadas de craque e aquele clima de amizade que só a PNG tem.</p> <br />
                    <p>Aqui, o futebol vai muito além das quatro linhas. Depois do apito final, a resenha continua com aquele churrasco de respeito, boas risadas e histórias que ficam para sempre. Seja no toque de bola refinado, nos lances de efeito ou na resenha pós-jogo, a PNG é sinônimo de diversão e companheirismo. </p> <br />
                    <p>Seja bem-vindo à Pelada Nova Geração, onde o futebol é arte, e a resenha é garantida! <br />⚽🍁🚬🍻</p>
                </div>
                <img src={Selecao} alt="Comunidade da Pelada Nova Geração" loading="lazy" />
            </div>
        </>
    )
}

export default Sobre
