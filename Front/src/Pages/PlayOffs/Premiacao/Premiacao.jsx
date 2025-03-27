import { useState, useEffect } from 'react'
import styles from './Premiacao.module.css'
import Header from '../../../Components/Header/Header'
import back from '../../../assets/backbtn.svg'
import { Link } from 'react-router-dom'


function Premiacao() {

    const [premios, setPremios] = useState([])

    useEffect(() => {
        const buscarPremios = async () => {
            const response = await fetch('https://raw.githubusercontent.com/guiabraao/apiClassificacao/refs/heads/main/Premiação')
            const data = await response.json()
            setPremios(data)
        }
        buscarPremios()
    }, [])

    return (
        <>
            <Header />
            <div className={styles.topEst}>
                <Link to='/playoff'><img src={back} /></Link>
            </div>
            <h2>Premiação Play-Offs</h2>

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
                                        <tr key={jogador.noim}>
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