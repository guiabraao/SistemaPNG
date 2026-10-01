import { useState } from 'react'
import PropTypes from 'prop-types'
export default function PlayerPortrait({ src, name, imageClass, fallbackClass, featured = false }) {
  const [failedSource, setFailedSource] = useState(null)
  const available = src && failedSource !== src
  return available ? <img className={imageClass} src={src} alt={`Card de ${name}`} loading={featured ? 'eager' : 'lazy'} onError={() => setFailedSource(src)} /> : <span className={fallbackClass} aria-label={name}>{name.slice(0,2).toUpperCase()}</span>
}
PlayerPortrait.propTypes = { src: PropTypes.string, name: PropTypes.string.isRequired, imageClass: PropTypes.string.isRequired, fallbackClass: PropTypes.string.isRequired, featured: PropTypes.bool }
