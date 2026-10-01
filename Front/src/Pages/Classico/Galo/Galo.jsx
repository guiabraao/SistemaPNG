import useRemote from '../../../hooks/useRemote.js'
import DataStatus from '../../../Components/DataStatus.jsx'

import styles from '../../../styles/Pages.module.css'
import Header from '../../../Components/Header/Header'
import back from '../../../assets/backbtn.svg'
import { Link } from 'react-router-dom'


function Galo() {

    const { data: galo, status, retry } = useRemote('https://raw.githubusercontent.com/guiabraao/apiClassificacao/refs/heads/main/apiGalo')



    return (
        <>
            <Header />
            <div className={styles.topEst}>
                <Link to='/classico'><img src={back} alt="Voltar" /></Link>
            </div>

            <h2>Jogadores Galo</h2>
<DataStatus status={status} retry={retry} empty={status === 'ready' && !galo.length} />

            <div className={styles.containerGalo}>
                <div className={styles.galoBox}>
                    <table>
                        <thead>
                            <tr>
                                <td>Jogador</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                galo.map((jogadores, index) => (
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

export default Galo
