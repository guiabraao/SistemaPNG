import useRemote from '../../../hooks/useRemote.js'
import DataStatus from '../../../Components/DataStatus.jsx'

import styles from '../../../styles/Pages.module.css'
import back from '../../../assets/backbtn.svg'
import { Link } from 'react-router-dom'
import Header from '../../../Components/Header/Header'

function PlayoffAssit() {

    const { data: assist, status, retry } = useRemote('https://raw.githubusercontent.com/guiabraao/apiClassificacao/refs/heads/main/apiAssistPlayoffs')




    return (
        <>
            <Header />

            <div className={styles.topEst}>
                <Link to='/playoff'><img src={back} alt="Voltar" /></Link>
            </div>
            <h2>Assistencias Play-Offs</h2>
<DataStatus status={status} retry={retry} empty={status === 'ready' && !assist.length} />

            <div className={styles.containerAssistPlay}>
                <div className={styles.assistPlayBox}>
                    <table>
                        <thead>
                            <tr>
                                <td>Jogador</td>
                                <td>Assistências</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                [...assist].sort((a, b) => b.assist - a.assist)
                                    .map((jogador) => (
                                        <tr key={jogador.id}>
                                            <td>{jogador.nome}</td>
                                            <td>{jogador.assist}</td>
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

export default PlayoffAssit
