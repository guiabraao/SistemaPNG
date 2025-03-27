import { useState, useEffect } from "react";
import styles from "./Eventos.module.css";
import Header from "../../Components/Header/Header";
import back from '../../assets/backbtn.svg'
import { Link } from "react-router-dom";

function Eventos() {

    const [events, setEvents] = useState([]);
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [details, setDatails] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);

    const addEvent = () => {
        if (!name || !date || !details) return alert("Preencha todos os campos");
        if (editingIndex !== null) {
            const updatedEvents = [...events];
            updatedEvents[editingIndex] = { name, date, details };
            setEvents(updatedEvents);
            setEditingIndex(null);
        } else {
            setEvents([...events, { name, date, details }]);
        }
        setName("");
        setDate("");
        setDatails("");
    };

    const editEvent = (index) => {
        setName(events[index].name);
        setDate(events[index].date);
        setDatails(events[index].details);
        setEditingIndex(index);
    };

    const deleteEvent = (index) => {
        setEvents(events.filter((_, i) => i !== index));
    };

    useEffect(() => {
        const storedEvents = JSON.parse(localStorage.getItem("eventos")) || [];
        setEvents(storedEvents);
    }, []);

    useEffect(() => {
        localStorage.setItem("eventos", JSON.stringify(events));
    }, [events]);

    return (
        <>
            <Header />

            <div className={styles.topEst}>
                <Link to='/menu'><img src={back} /></Link>
            </div>
            <div className={styles.headerEventos}>
                <h2>Eventos PNG</h2>

                <p>Somente a dretoria pode <br /> fazer alterações nessa página!!</p>

            </div>

            

            <div className={styles.containerEventos}>
                <div className={styles.eventoFormBox}>
                    <input
                        type="text"
                        placeholder="Nome do Evento"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                     <input
                        type="text"
                        placeholder="Detalhes"
                        value={details}
                        onChange={(e) => setDatails(e.target.value)}
                    />
                    <button onClick={addEvent}>{editingIndex !== null ? "Atualizar Evento" : "Adicionar Evento"}</button>
                </div>
                <div className={styles.eventosList}>
                    <ul>
                        {events.map((event, index) => (
                            <li key={index}>
                                <span>
                                    <p>Evento: {event.name}</p> <br />
                                    <p>Data: {event.date}</p> <br /> <br />
                                    <p>Detalhes: {event.details}</p>
                                </span>
                                <div>
                                    <button className={styles.btnEditar} onClick={() => editEvent(index)}>Editar</button>
                                    <button className={styles.btnExcluir} onClick={() => deleteEvent(index)}>Excluir</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
}

export default Eventos