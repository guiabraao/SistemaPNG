import useRemote from '../../../hooks/useRemote.js'
import DataStatus from '../../../Components/DataStatus.jsx'

import styles from '../../../styles/Pages.module.css'
import back from '../../../assets/backbtn.svg'
import Header from '../../../Components/Header/Header'
import { Link } from 'react-router-dom'

function Classificacao(){

    const { data: times, status, retry } = useRemote('https://raw.githubusercontent.com/guiabraao/apiClassificacao/refs/heads/main/Final')






    return(
        <>
            <Header />
            <div className={styles.topEst}>
                <Link to='/playoff'><img src={back} alt="Voltar" /></Link>
            </div>
            <h2>Final</h2>
<DataStatus status={status} retry={retry} empty={status === 'ready' && !times.length} />

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
