import { useEffect, useState, useCallback } from 'react'
const cache = new Map()
export default function useRemote(url) {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState({ url: null, data: [], status: 'loading' })
  useEffect(() => {
    if (!url) return
    const controller = new AbortController()
    if (cache.has(url)) {
      setResult({ url, data: cache.get(url), status: 'ready' })
    } else {
      setResult({ url, data: [], status: 'loading' })
    }
    fetch(url, { signal: controller.signal }).then(response => {
      if (!response.ok) throw new Error('Dados indisponíveis')
      return response.json()
    }).then(data => {
      if (!Array.isArray(data)) throw new Error('Formato inválido')
      cache.set(url, data)
      setResult({ url, data, status: 'ready' })
    }).catch(error => {
      if (error.name !== 'AbortError') setResult({ url, data: [], status: 'error' })
    })
    return () => controller.abort()
  }, [url, attempt])
  const retry = useCallback(() => { cache.delete(url); setAttempt(value => value + 1) }, [url])
  if (!url) return { data: [], status: 'unavailable', retry }
  return { ...(result.url === url ? result : { data: [], status: 'loading' }), retry }
}
