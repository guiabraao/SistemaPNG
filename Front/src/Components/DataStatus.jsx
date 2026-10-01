import PropTypes from 'prop-types'
export default function DataStatus({ status, retry, empty }) {
  if (status === 'loading') return <div className="status-panel" role="status">Carregando os dados da pelada…</div>
  if (status === 'error') return <div className="status-panel" role="alert"><strong>Não foi possível carregar.</strong><p>Confira sua conexão e tente novamente.</p><button onClick={retry}>Tentar novamente</button></div>
  if (empty) return <div className="status-panel" role="status">Nenhum registro disponível no momento.</div>
  return null
}
DataStatus.propTypes = { status: PropTypes.string.isRequired, retry: PropTypes.func.isRequired, empty: PropTypes.bool }
