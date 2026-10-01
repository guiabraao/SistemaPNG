const root = '/api/admin'

export async function adminApi(path, options = {}) {
  const response = await fetch(`${root}${path}`, {
    credentials: 'same-origin',
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.method && options.method !== 'GET' ? { 'X-PNG-Admin': '1' } : {}),
    },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })
  const result = await response.json().catch(() => ({}))
  if (!response.ok) {
    if (response.status === 401 && path !== '/login' && path !== '/session') window.dispatchEvent(new Event('png-admin-unauthorized'))
    const error = new Error(result.error || 'Não foi possível concluir. Tente novamente.')
    error.status = response.status
    throw error
  }
  return result
}

export function dateLabel(date) {
  if (!date) return ''
  const [year, month, day] = date.split('-')
  return `${day}/${month}/${year}`
}
