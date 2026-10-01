import useRemote from '../../../hooks/useRemote.js'
import DataStatus from '../../../Components/DataStatus.jsx'

import styles from '../../../styles/Pages.module.css'
import Header from '../../../Components/Header/Header'
import back from '../../../assets/backbtn.svg'
import { Link } from 'react-router-dom'

function Classificacao(){

    const { data: times, status, retry } = useRemote('https://raw.githubusercontent.com/guiabraao/apiClassificacao/refs/heads/main/classificacao')



    return(
        <>
            <Header />
            <div className={styles.topEst}>
                <Link to='/playoff'><img src={back} alt="Voltar" /></Link>
            </div>
            <h2>Classificação</h2>
<DataStatus status={status} retry={retry} empty={status === 'ready' && !times.length} />

            <div className={styles.containerTable}>
            <div className={styles.tablestyle}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th></th>
                            <th>#</th>
                            <th>Time</th>
                            <th>P</th>
                            <th>V</th>
                            <th>E</th>
                            <th>D</th>
                            <th>J</th>
                            <th>SG</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            times.map((time) => (
                                <tr key={time.posicao}>
                                    <td>{time.imagem}</td>
                                    <td>{time.posicao}</td>
                                    <td>{time.nome}</td>
                                    <td>{time.pontos}</td>
                                    <td>{time.vitorias}</td>
                                    <td>{time.empates}</td>
                                    <td>{time.derrotas}</td>
                                    <td>{time.jogos}</td>
                                    <td>{time.saldogol}</td>
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

export default Classificacao
