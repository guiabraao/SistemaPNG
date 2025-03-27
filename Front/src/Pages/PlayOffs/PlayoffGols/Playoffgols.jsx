import { useState, useEffect } from 'react'
import styles from './Playoffgols.module.css'
import Header from '../../../Components/Header/Header'
import back from '../../../assets/backbtn.svg'
import { Link } from 'react-router-dom'


function PlayoffGols() {

    const [gols, setGols] = useState([])

    useEffect(() => {
        const buscarGols = async () => {
            const response = await fetch('https://raw.githubusercontent.com/guiabraao/apiClassificacao/refs/heads/main/apiArtilhariaPlayoffs')
            const data = await response.json()
            setGols(data)
        }
        buscarGols()
    }, [])

    return (
        <>
            <Header />
            <div className={styles.topEst}>
                <Link to='/playoff'><img src={back} /></Link>
            </div>
            <h2>Artilharia Play-Offs</h2>

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
                                gols.sort((a, b) => b.gols - a.gols)
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