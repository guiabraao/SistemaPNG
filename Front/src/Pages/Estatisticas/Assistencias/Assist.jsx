import { useState, useEffect } from 'react';
import styles from './Assist.module.css'
import Header from '../../../Components/Header/Header';
import back from '../../../assets/backbtn.svg'
import { Link } from 'react-router-dom';



function Assistencias(){

    const [assist, setAssist] = useState([]);

    useEffect(() => {
        const buscarAssist = async () => {
            const response = await fetch('https://raw.githubusercontent.com/guiabraao/apiClassificacao/refs/heads/main/apiAssistGeral');
            const data = await response.json();
            console.log("Dados recebidos:", data);
            setAssist(data);
        };
        buscarAssist();
    }, []);

    return(
        <>
            <Header />
            <div className={styles.topEst}>
                <Link to='/estatisticas'><img src={back} /></Link>
            </div>
            
            <h2>Assistencias</h2>


            <div className={styles.containerAssist}>
                <div className={styles.assistBox}>
                    <table>
                        <thead>
                            <tr>
                                <td>Jogador</td>
                                <td>Assist</td>
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

export default Assistencias