import { useEffect, useState } from 'react';
import styles from './Gols.module.css';
import Header from '../../../Components/Header/Header';
import back from '../../../assets/backbtn.svg'
import { Link } from 'react-router-dom';

function Gols() {
    const [gols, setGols] = useState([]);

    useEffect(() => {
        const buscarGols = async () => {
            const response = await fetch('https://raw.githubusercontent.com/guiabraao/apiClassificacao/refs/heads/main/apiArtilhariaGeral');
            const data = await response.json();
            console.log("Dados recebidos:", data);
            setGols(data);
        };
        buscarGols();
    }, []);

    return (
        <>
            <Header />
            <div className={styles.topEst}>
                <Link to='/estatisticas'><img src={back} /></Link>
            </div>
            <h2>Artilharia</h2>

            <div className={styles.containerGol}>
                <div className={styles.golBox}>
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
    );
}

export default Gols;