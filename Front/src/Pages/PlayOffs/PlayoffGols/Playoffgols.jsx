import useRemote from '../../../hooks/useRemote.js'
import DataStatus from '../../../Components/DataStatus.jsx'

import styles from '../../../styles/Pages.module.css'
import Header from '../../../Components/Header/Header'
import back from '../../../assets/backbtn.svg'
import { Link } from 'react-router-dom'


function PlayoffGols() {

    const { data: gols, status, retry } = useRemote('https://raw.githubusercontent.com/guiabraao/apiClassificacao/refs/heads/main/apiArtilhariaPlayoffs')



    return (
        <>
            <Header />
            <div className={styles.topEst}>
                <Link to='/playoff'><img src={back} alt="Voltar" /></Link>
            </div>
            <h2>Artilharia Play-Offs</h2>
<DataStatus status={status} retry={retry} empty={status === 'ready' && !gols.length} />

            <div className={styles.containerGolPlay}>
                <div className={styles.golPlayBox}>
                    <table>
                        <thead>
                            <tr>
                                <td>Jogador</td>
                                <td>Gols</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                [...gols].sort((a, b) => b.gols - a.gols)
                                    .map((jogador) => (
                                        <tr key={jogador.id}>
                                            <td>{jogador.nome}</td>
                                            <td>{jogador.gols}</td>
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

export default PlayoffGols
