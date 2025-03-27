import {useEffect, useState} from 'react'
import styles from './Final.module.css'
import back from '../../../assets/backbtn.svg'
import Header from '../../../Components/Header/Header'
import { Link } from 'react-router-dom'

function Classificacao(){

    const [ times, setTimes ] = useState([])

    useEffect(() => {
        const buscarTimes = async () => {
            const response = await fetch('https://raw.githubusercontent.com/guiabraao/apiClassificacao/refs/heads/main/Final')
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
            <h2>Final</h2>

            <div className={styles.containerFinal}>
                <div className={styles.finalBox}>
                    {
                        times.map((time) => ( 
                            <div key={time.nome}>
                                <img src={time.img}/> 
                                <h1>{time.nome} - {time.gols}</h1>
                            </div>
                            
                            
                        ))
                    }
                </div>
            </div>
        </>
    )
}

export default Classificacao