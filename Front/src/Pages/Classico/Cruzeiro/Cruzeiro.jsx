import useRemote from '../../../hooks/useRemote.js'
import DataStatus from '../../../Components/DataStatus.jsx'

import styles from '../../../styles/Pages.module.css'
import Header from '../../../Components/Header/Header'
import back from '../../../assets/backbtn.svg'
import { Link } from 'react-router-dom'


function Cruzeiro() {

    const { data: cruz, status, retry } = useRemote('https://raw.githubusercontent.com/guiabraao/apiClassificacao/refs/heads/main/apiCruzeiro')



    return (
        <>
            <Header />
            <div className={styles.topEst}>
                <Link to='/classico'><img src={back} alt="Voltar" /></Link>
            </div>
            <h2>Jogadores Cruzeiro</h2>
<DataStatus status={status} retry={retry} empty={status === 'ready' && !cruz.length} />

            <div className={styles.containerCruz}>
                <div className={styles.cruzBox}>
                    <table>
                        <thead>
                            <tr>
                                <td>Jogador</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                cruz.map((jogadores, index) => (
                                        <tr key={index}>
                                            <td>{jogadores.nome}</td>
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

export default Cruzeiro
