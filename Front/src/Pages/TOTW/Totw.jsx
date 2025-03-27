import { useEffect, useState } from "react";
import styles from "./Totw.module.css";
import back from '../../assets/backbtn.svg'
import Logo from '../../assets/logoPNG.png'
import Campo from '../../assets/campo.jpg'
import { Link } from "react-router-dom";
import Header from "../../Components/Header/Header";

function Totw() {

    const [cards, setCards] = useState([])

    useEffect(() => {
        const buscarCard = async () => {
            const response = await fetch('https://raw.githubusercontent.com/guiabraao/apiClassificacao/refs/heads/main/card')
            const data = await response.json()
            setCards(data)
        }
        buscarCard()
    }, [])


    return (
        <>
            <Header />

            <div className={styles.topEst}>
                <Link to='/menu'><img src={back} /></Link>
            </div>

            <h2>Seleção da Semana</h2>

            <div className={styles.containerTW}>
                <img src={Campo} />
                <div className={styles.containeBoxTW}>
                    <div className={styles.atacantes}>
                        {
                            cards.map((card) => (
                                <tr key={card.atacantes}>
                                    <td><img src={card.joval} className={styles.cardTW} /></td>
                                    <td><img src={card.joval} className={styles.cardTW} /></td>
                                </tr>
                            ))
                        }
                    </div>
                    <div className={styles.pontas}>
                        {
                            cards.map((card) => (
                                <tr key={card.tuco}>
                                    <td className={styles.pe}><img src={card.joval} className={styles.cardTW} /></td>
                                    <td className={styles.pd}><img src={card.joval} className={styles.cardTW} /></td>
                                </tr>
                            ))
                        }
                    </div>
                    <div className={styles.meias}>
                        {
                            cards.map((card) => (
                                <tr key={card.tuco}>
                                    <td><img src={card.joval} className={styles.cardTW} /></td>
                                    <td><img src={card.joval} className={styles.cardTW} /></td>
                                </tr>
                            ))
                        }
                    </div>
                    <div className={styles.laterais}>
                        {
                            cards.map((card) => (
                                <tr key={card.tuco}>
                                    <td className={styles.le}><img src={card.lamartine} className={styles.cardTW} /></td>
                                    <td className={styles.ld}><img src={card.lamartine} className={styles.cardTW} /></td>
                                </tr>
                            ))
                        }
                    </div>
                    <div className={styles.zaga}>
                        {
                            cards.map((card) => (
                                <tr key={card.tuco}>
                                    <td><img src={card.lamartine} className={styles.cardTW} /></td>
                                    <td><img src={card.lamartine} className={styles.cardTW} /></td>
                                </tr>
                            ))
                        }
                    </div>
                    <div className={styles.goleiro}>
                        {
                            cards.map((card) => (
                                <tr key={card.tuco}>
                                    <td><img src={card.lamartine} className={styles.cardTW} /></td>
                                </tr>
                            ))
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Totw