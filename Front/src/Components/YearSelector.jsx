import PropTypes from 'prop-types'
import { YEARS } from '../data/seasons'
import styles from '../Pages/Estatisticas/Ranking.module.css'
export default function YearSelector({ activeYear, onChange, label }) {
  return <div className={styles.seasons} role="group" aria-label={label}>
    <span className={styles.indicator} style={{ transform: `translateX(${YEARS.indexOf(activeYear) * 100}%)` }} />
    {YEARS.map(year => <button key={year} type="button" aria-pressed={activeYear === year} onClick={() => onChange(year)}>{year}</button>)}
  </div>
}
YearSelector.propTypes = { activeYear: PropTypes.number.isRequired, onChange: PropTypes.func.isRequired, label: PropTypes.string.isRequired }
