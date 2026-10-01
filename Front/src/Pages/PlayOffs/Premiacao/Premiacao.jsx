import useRemote from '../../../hooks/useRemote.js'
import DataStatus from '../../../Components/DataStatus.jsx'

import styles from '../../../styles/Pages.module.css'
import Header from '../../../Components/Header/Header'
import back from '../../../assets/backbtn.svg'
import { Link } from 'react-router-dom'


function Premiacao() {

    const { data: premios, status, retry } = useRemote('https://raw.githubusercontent.com/guiabraao/apiClassificacao/refs/heads/main/Premiação')



    return (
        <>
            <Header />
            <div className={styles.topEst}>
                <Link to='/playoff'><img src={back} alt="Voltar" /></Link>
            </div>
            <h2>Premiação Play-Offs</h2>
<DataStatus status={status} retry={retry} empty={status === 'ready' && !premios.length} />

            <div className={styles.containerPremiPlay}>
                <div className={styles.premiPlayBox}>
                    <table>
                        <thead>
                            <tr>
                                <td>Jogador</td>
                                <td>Premio</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                premios.map((jogador) => (
                                        <tr key={jogador.nome}>
                                            <td>{jogador.nome}</td>
                                            <td>{jogador.premio}</td>
                                        </tr>
                                    ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}


export default Premiacao
