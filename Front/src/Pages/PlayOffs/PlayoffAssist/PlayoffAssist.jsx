import { useState, useEffect } from 'react'
import styles from './PlayoffAssist.module.css'
import back from '../../../assets/backbtn.svg'
import { Link } from 'react-router-dom'
import Header from '../../../Components/Header/Header'

function PlayoffAssit() {

    const [assist, setAssist] = useState([])

    useEffect(() => {
        const buscarAssist = async () => {
            const response = await fetch('https://raw.githubusercontent.com/guiabraao/apiClassificacao/refs/heads/main/apiAssistPlayoffs')
            const data = await response.json()
            setAssist(data)
        }
        buscarAssist()
    }, [])


    return (
        <>
            <Header />

            <div className={styles.topEst}>
                <Link to='/playoff'><img src={back} /></Link>
            </div>
            <h2>Assistencias Play-Offs</h2>

            <div className={styles.containerAssistPlay}>
                <div className={styles.assistPlayBox}>
                    <table>
                        <thead>
                            <tr>
                                <td>Jogador</td>
                                <td>Gols</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                assist.sort((a, b) => b.assist - a.assist)
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
