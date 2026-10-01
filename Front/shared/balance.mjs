const average = (team) => team.reduce((sum, player) => sum + player.nota, 0) / team.length
const positionOf = player => typeof player.posicao === 'string' ? player.posicao.trim() : ''
export function balanceMetrics(teams) {
  const averages = teams.map(average)
  const highestAverage = Math.max(...averages)
  const lowestAverage = Math.min(...averages)
  const balanceDifference = highestAverage - lowestAverage
  return { averages, highestAverage, lowestAverage, balanceDifference,
    quality: balanceDifference <= .25 ? 'Excelente' : balanceDifference <= .6 ? 'Bom' : 'Pode melhorar' }
}
const signature = teams => teams.map(team => team.map(player => String(player.id)).sort().join('|')).sort().join('::')
function shuffled(items, random) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}
function score(totals, playersPerTeam) {
  const averages = totals.map(total => total / playersPerTeam)
  const mean = averages.reduce((sum, value) => sum + value, 0) / averages.length
  return (Math.max(...averages) - Math.min(...averages)) * 100 + averages.reduce((sum, value) => sum + (value - mean) ** 2, 0)
}
function positionTargets(groups, teamCount, playersPerTeam, random) {
  const targets = Array.from({ length: teamCount }, () => new Map())
  const extraLoads = Array(teamCount).fill(0)
  const remainders = []
  let baseLoad = 0
  for (const [position, group] of groups) {
    const base = Math.floor(group.length / teamCount)
    const remainder = group.length % teamCount
    baseLoad += base
    for (const target of targets) target.set(position, base)
    if (remainder) remainders.push({ position, remainder })
  }
  for (const { position, remainder } of shuffled(remainders, random).sort((a, b) => b.remainder - a.remainder)) {
    const recipients = shuffled([...targets.keys()], random).sort((a, b) => extraLoads[a] - extraLoads[b]).slice(0, remainder)
    for (const teamIndex of recipients) {
      targets[teamIndex].set(position, targets[teamIndex].get(position) + 1)
      extraLoads[teamIndex]++
    }
  }
  if (extraLoads.some(load => load + baseLoad !== playersPerTeam)) throw new Error('Não foi possível distribuir as posições entre os times.')
  return targets
}
function canSwap(counts, minima, maxima, a, b, first, second) {
  const firstPosition = positionOf(first), secondPosition = positionOf(second)
  if (firstPosition === secondPosition) return true
  return counts[a].get(firstPosition) > minima.get(firstPosition)
    && counts[b].get(secondPosition) > minima.get(secondPosition)
    && counts[a].get(secondPosition) < maxima.get(secondPosition)
    && counts[b].get(firstPosition) < maxima.get(firstPosition)
}
export function generateBalancedTeams(players, teamCount, playersPerTeam, options = {}) {
  const { random = Math.random, avoidSignature = '' } = options
  if (!Number.isInteger(teamCount) || !Number.isInteger(playersPerTeam) || teamCount < 2 || playersPerTeam < 2 || players.length !== teamCount * playersPerTeam) throw new Error('Quantidade de jogadores incompatível com os times.')
  if (players.some(player => typeof player.nota !== 'number' || !Number.isFinite(player.nota) || player.nota < 0 || player.nota > 10)) throw new Error('Todos os jogadores precisam de nota entre 0 e 10.')
  const groups = new Map()
  for (const player of players) {
    const position = positionOf(player)
    if (!groups.has(position)) groups.set(position, [])
    groups.get(position).push(player)
  }
  const minima = new Map([...groups].map(([position, group]) => [position, Math.floor(group.length / teamCount)]))
  const maxima = new Map([...groups].map(([position, group]) => [position, Math.ceil(group.length / teamCount)]))
  const runs = players.length <= 24 ? 140 : players.length <= 48 ? 70 : 24
  const candidates = []
  let bestScore = Infinity
  for (let run = 0; run < runs; run++) {
    const targets = positionTargets(groups, teamCount, playersPerTeam, random)
    const teams = Array.from({ length: teamCount }, () => [])
    const totals = Array(teamCount).fill(0)
    const counts = Array.from({ length: teamCount }, () => new Map([...groups.keys()].map(position => [position, 0])))
    for (const [position, group] of shuffled([...groups], random)) {
      for (const player of shuffled(group, random).sort((a, b) => b.nota - a.nota)) {
        const recipients = shuffled([...teams.keys()], random).filter(index => counts[index].get(position) < targets[index].get(position))
        const recipient = recipients.reduce((best, index) => totals[index] < totals[best] ? index : best)
        teams[recipient].push(player)
        totals[recipient] += player.nota
        counts[recipient].set(position, counts[recipient].get(position) + 1)
      }
    }
    let currentScore = score(totals, playersPerTeam)
    for (let pass = 0; pass < 12; pass++) {
      let bestSwap = null
      let improved = currentScore - 1e-9
      for (let a = 0; a < teamCount; a++) for (let b = a + 1; b < teamCount; b++) {
        for (let i = 0; i < playersPerTeam; i++) for (let j = 0; j < playersPerTeam; j++) {
          const first = teams[a][i], second = teams[b][j]
          if (!canSwap(counts, minima, maxima, a, b, first, second)) continue
          const nextTotals = [...totals]
          nextTotals[a] += second.nota - first.nota
          nextTotals[b] += first.nota - second.nota
          const candidateScore = score(nextTotals, playersPerTeam)
          if (candidateScore < improved) {
            improved = candidateScore
            bestSwap = [a, b, i, j]
          }
        }
      }
      if (!bestSwap) break
      const [a, b, i, j] = bestSwap
      const firstPosition = positionOf(teams[a][i]), secondPosition = positionOf(teams[b][j])
      totals[a] += teams[b][j].nota - teams[a][i].nota
      totals[b] += teams[a][i].nota - teams[b][j].nota
      if (firstPosition !== secondPosition) {
        counts[a].set(firstPosition, counts[a].get(firstPosition) - 1)
        counts[a].set(secondPosition, counts[a].get(secondPosition) + 1)
        counts[b].set(secondPosition, counts[b].get(secondPosition) - 1)
        counts[b].set(firstPosition, counts[b].get(firstPosition) + 1)
      }
      ;[teams[a][i], teams[b][j]] = [teams[b][j], teams[a][i]]
      currentScore = improved
    }
    bestScore = Math.min(bestScore, currentScore)
    candidates.push({ teams: teams.map(team => [...team]), score: currentScore, signature: signature(teams) })
  }
  const acceptable = candidates.filter(item => item.score <= bestScore + 15)
  const distinct = [...new Map(acceptable.map(item => [item.signature, item])).values()]
  const choices = distinct.filter(item => item.signature !== avoidSignature)
  const chosen = shuffled(choices.length ? choices : distinct, random)[0]
  const teams = chosen.teams.map((players, index) => ({ id: index + 1, players, totalRating: players.reduce((sum, player) => sum + player.nota, 0), average: average(players) }))
  return { teams, ...balanceMetrics(chosen.teams), signature: chosen.signature }
}
