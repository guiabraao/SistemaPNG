import { useState, useEffect } from 'react'
import styles from './Galo.module.css'
import Header from '../../../Components/Header/Header'
import back from '../../../assets/backbtn.svg'
import { Link } from 'react-router-dom'


function Galo() {

    const [galo, setGalo] = useState([])

    useEffect(() => {
        const buscarGalo = async () => {
            const response = await fetch('https://raw.githubusercontent.com/guiabraao/apiClassificacao/refs/heads/main/apiGalo')
            const data = await response.json()
            setGalo(data)
        }
        buscarGalo()
    }, [])

    return (
        <>
            <Header />
            <div className={styles.topEst}>
                <Link to='/classico'><img src={back} /></Link>
            </div>

            <h2>Jogadores Galo</h2>

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