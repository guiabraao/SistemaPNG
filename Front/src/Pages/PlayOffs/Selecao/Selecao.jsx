import useRemote from '../../../hooks/useRemote.js'
import DataStatus from '../../../Components/DataStatus.jsx'

import styles from '../../../styles/Pages.module.css';
import back from '../../../assets/backbtn.svg'
import Campo from '../../../assets/campo.jpg'
import { Link } from "react-router-dom";
import Header from "../../../Components/Header/Header";

function Selecao(){

    const { data: cards, status, retry } = useRemote('https://raw.githubusercontent.com/guiabraao/apiClassificacao/refs/heads/main/card')




    return(
        <>
            <Header />

            <div className={styles.topEst}>
                <Link to='/playoff'><img src={back} alt="Voltar" /></Link>
            </div>

            <h2>Seleção dos Play-Offs</h2>
<DataStatus status={status} retry={retry} empty={status === 'ready' && !cards.length} />

            <div className={styles.containerTW}>
                <img src={Campo} alt="Campo de futebol com a seleção" />
                <div className={styles.containeBoxTW}>
                    <div className={styles.atacantes}>
                        {
                            cards.map((card) => (
                                <div data-line key={Object.values(card).join('|')}>
                                    <div data-slot><img alt="Card do jogador" loading="lazy" src={card.davi} className={styles.cardTW}/></div>
                                    <div data-slot><img alt="Card do jogador" loading="lazy" src={card.davi} className={styles.cardTW}/></div>
                                </div>
                            ))
                        }
                    </div>
                    <div className={styles.pontas}>
                        {
                            cards.map((card) => (
                                <div data-line key={Object.values(card).join('|')}>
                                    <div data-slot className={styles.pe}><img alt="Card do jogador" loading="lazy" src={card.davi} className={styles.cardTW}/></div>
                                    <div data-slot className={styles.pd}><img alt="Card do jogador" loading="lazy" src={card.davi} className={styles.cardTW}/></div>
                                </div>
                            ))
                        }
                    </div>
                    <div className={styles.meias}>
                        {
                            cards.map((card) => (
                                <div data-line key={Object.values(card).join('|')}>
                                    <div data-slot><img alt="Card do jogador" loading="lazy" src={card.davi} className={styles.cardTW}/></div>
                                    <div data-slot><img alt="Card do jogador" loading="lazy" src={card.davi} className={styles.cardTW}/></div>
                                </div>
                            ))
                        }
                    </div>
                    <div className={styles.laterais}>
                        {
                            cards.map((card) => (
                                <div data-line key={Object.values(card).join('|')}>
                                    <div data-slot className={styles.le}><img alt="Card do jogador" loading="lazy" src={card.davi} className={styles.cardTW}/></div>
                                    <div data-slot className={styles.ld}><img alt="Card do jogador" loading="lazy" src={card.davi} className={styles.cardTW}/></div>
                                </div>
                            ))
                        }
                    </div>
                    <div className={styles.zaga}>
                        {
                            cards.map((card) => (
                                <div data-line key={Object.values(card).join('|')}>
                                    <div data-slot><img alt="Card do jogador" loading="lazy" src={card.davi} className={styles.cardTW}/></div>
                                    <div data-slot><img alt="Card do jogador" loading="lazy" src={card.davi} className={styles.cardTW}/></div>
                                </div>
                            ))
                        }
                    </div>
                    <div className={styles.goleiro}>
                        {
                            cards.map((card) => (
                                <div data-line key={Object.values(card).join('|')}>
                                    <div data-slot><img alt="Card do jogador" loading="lazy" src={card.davi} className={styles.cardTW}/></div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Selecao
