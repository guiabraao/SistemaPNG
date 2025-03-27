import {useEffect, useState} from 'react'
import styles from './Classifi.module.css'
import Header from '../../../Components/Header/Header'
import back from '../../../assets/backbtn.svg'
import { Link } from 'react-router-dom'

function Classificacao(){

    const [ times, setTimes ] = useState([])

    useEffect(() => {
        const buscarTimes = async () => {
            const response = await fetch('https://raw.githubusercontent.com/guiabraao/apiClassificacao/refs/heads/main/classificacao')
            const data = await response.json()
            setTimes(data)
        }
        buscarTimes()
    }, [])

    return(
        <>
            <Header />
            <div className={styles.topEst}>
                <Link to='/playoff'><img src={back} /></Link>
            </div>
            <h2>Classificação</h2>

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