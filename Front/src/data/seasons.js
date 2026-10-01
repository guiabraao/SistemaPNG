// 2025 uses the final published revisions of the original feeds.
// 2026 assists are maintained locally from the supplied player list.
export const CURRENT_SEASON = 2026
export const YEARS = [2025, 2026]
export const statistics = {
  goals: {
    2025: { label: 'Histórico', url: 'https://raw.githubusercontent.com/guiabraao/apiClassificacao/656798e0f995d6dbf28296c474d201d59fb81aad/apiArtilhariaGeral' },
    2026: { label: 'Temporada atual', url: 'https://raw.githubusercontent.com/guiabraao/apiClassificacao/refs/heads/main/apiArtilhariaGeral' },
  },
  assists: {
    2025: { label: 'Histórico', url: 'https://raw.githubusercontent.com/guiabraao/apiClassificacao/4f8314f6442dfd3115b1f3adfe21c238bc9ac41f/apiAssistGeral' },
    2026: { label: 'Temporada atual', url: '/data/assistencias-2026.json' },
  },
}
export const playerCardsUrl = 'https://raw.githubusercontent.com/guiabraao/apiClassificacao/refs/heads/main/card'
const aliases = { 'gui vb': 'guivb', 'gui c': 'guic', 'samuel n': 'nvskk', 'henrique m': 'henrique' }
export function playerImage(player, cards) {
  if (player.foto || player.imagem || player.img) return player.foto || player.imagem || player.img
  const name = player.nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
  if (name === 'leo') return null
  const key = aliases[name] || name.replace(/\s/g, '')
  return cards.find(card => card[key])?.[key] || null
}
export function statisticValue(player, type) {
  const raw = type === 'assists' ? player.assistencias ?? player.assist : player.gols
  const value = Number(raw)
  return Number.isFinite(value) ? value : 0
}
export function rankPlayers(players, type = 'goals') {
  let position = 0
  let lastValue = null
  return [...players].sort((a, b) => statisticValue(b, type) - statisticValue(a, type)).map((player, index) => {
    const value = statisticValue(player, type)
    if (value !== lastValue) position = index + 1
    lastValue = value
    return { ...player, position, value }
  })
}
