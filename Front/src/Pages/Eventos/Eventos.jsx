import { useEffect, useState } from 'react'
import Header from '../../Components/Header/Header'
import Icon from '../../Components/Icon'
import { Link } from 'react-router-dom'
import styles from './Eventos.module.css'
function readEvents() {
  try { const stored = JSON.parse(localStorage.getItem('eventos')); return Array.isArray(stored) ? stored : [] } catch { return [] }
}
export default function Eventos() {
  const [events, setEvents] = useState(readEvents)
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [details, setDetails] = useState('')
  const [editingIndex, setEditingIndex] = useState(null)
  const [storageError, setStorageError] = useState(false)
  useEffect(() => {
    try { localStorage.setItem('eventos', JSON.stringify(events)); setStorageError(false) } catch { setStorageError(true) }
  }, [events])
  function resetForm() { setName(''); setDate(''); setDetails(''); setEditingIndex(null) }
  function addEvent(e) {
    e.preventDefault()
    if (!name.trim() || !date || !details.trim()) return
    const event = { name: name.trim(), date, details: details.trim() }
    setEvents(current => editingIndex !== null ? current.map((item,i) => i === editingIndex ? event : item) : [...current,event])
    resetForm()
  }
  function editEvent(index) { setName(events[index].name); setDate(events[index].date); setDetails(events[index].details); setEditingIndex(index); document.getElementById('event-name').focus() }
  function deleteEvent(index) {
    setEvents(current => current.filter((_,i) => i !== index))
    if (editingIndex === index) resetForm()
    else if (editingIndex !== null && editingIndex > index) setEditingIndex(editingIndex - 1)
  }
  return <><Header /><Link to="/menu" className={styles.back}>← Explorar</Link><span className="eyebrow">A RESENHA CONTINUA</span><h2>Eventos PNG<span className={styles.dot}>.</span></h2><p className={styles.intro}>Nossa agenda, dentro e fora de campo.</p>
    {storageError && <p role="alert" className="status-panel">Não foi possível salvar neste dispositivo. Confira o armazenamento do navegador.</p>}
    <div className={styles.layout}><section className={styles.formPanel} data-animate><span className="eyebrow">ORGANIZAÇÃO</span><h3>{editingIndex !== null ? 'Editar evento' : 'Novo encontro'}</h3><p className={styles.directors}>Somente a diretoria pode fazer alterações.</p><form onSubmit={addEvent}><label htmlFor="event-name">Nome do evento</label><input id="event-name" required value={name} onChange={e => setName(e.target.value)} placeholder="Qual é o próximo encontro?"/><label htmlFor="event-date">Data</label><input id="event-date" type="date" required value={date} onChange={e => setDate(e.target.value)}/><label htmlFor="event-details">Detalhes</label><input id="event-details" required value={details} onChange={e => setDetails(e.target.value)} placeholder="Local, horário e outras informações"/><button type="submit">{editingIndex !== null ? 'Salvar alterações' : 'Adicionar evento'} <span>↗</span></button>{editingIndex !== null && <button type="button" className={styles.cancel} onClick={resetForm}>Cancelar edição</button>}</form></section>
    <section><div className="section-heading"><h2>Na agenda</h2><span className={styles.count}>{events.length} {events.length === 1 ? 'evento' : 'eventos'}</span></div>{!events.length && <div className={styles.empty}><Icon name="calendar"/><h3>Espaço para a próxima resenha.</h3><p>Os eventos adicionados pela diretoria aparecem aqui.</p></div>}<ul className={styles.list}>{events.map((event,index) => <li key={index}><div className={styles.eventDate}><Icon name="calendar"/><time dateTime={event.date}>{new Date(`${event.date}T12:00:00`).toLocaleDateString('pt-BR', { day:'2-digit', month:'short', year:'numeric' })}</time></div><h3>{event.name}</h3><p>{event.details}</p><div className={styles.actions}><button onClick={() => editEvent(index)}>Editar</button><button onClick={() => deleteEvent(index)} className={styles.delete}>Excluir</button></div></li>)}</ul><p className={styles.localNote}>Eventos salvos neste navegador.</p></section></div>
  </>
}
