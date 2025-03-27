import { useState, useEffect } from 'react'
import styles from './Cruzeiro.module.css'
import Header from '../../../Components/Header/Header'
import back from '../../../assets/backbtn.svg'
import { Link } from 'react-router-dom'


function Cruzeiro() {

    const [cruz, setCruz] = useState([])

    useEffect(() => {
        const buscarCruz = async () => {
            const response = await fetch('https://raw.githubusercontent.com/guiabraao/apiClassificacao/refs/heads/main/apiCruzeiro')
            const data = await response.json()
            setCruz(data)
        }
        buscarCruz()
    }, [])

    return (
        <>
            <Header />
            <div className={styles.topEst}>
                <Link to='/classico'><img src={back} /></Link>
            </div>
            <h2>Jogadores Cruzeiro</h2>

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