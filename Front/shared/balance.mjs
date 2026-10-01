const average = (team) => team.reduce((sum, player) => sum + player.nota, 0) / team.length
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
function score(teams) {
  const { averages, balanceDifference } = balanceMetrics(teams)
  const mean = averages.reduce((sum, value) => sum + value, 0) / averages.length
  return balanceDifference * 100 + averages.reduce((sum, value) => sum + (value - mean) ** 2, 0)
}
export function generateBalancedTeams(players, teamCount, playersPerTeam, options = {}) {
  const { random = Math.random, avoidSignature = '' } = options
  if (!Number.isInteger(teamCount) || !Number.isInteger(playersPerTeam) || teamCount < 2 || playersPerTeam < 2 || players.length !== teamCount * playersPerTeam) throw new Error('Quantidade de jogadores incompatível com os times.')
  if (players.some(player => typeof player.nota !== 'number' || !Number.isFinite(player.nota) || player.nota < 0 || player.nota > 10)) throw new Error('Todos os jogadores precisam de nota entre 0 e 10.')
  const ordered = [...players].sort((a, b) => b.nota - a.nota)
  const runs = players.length <= 24 ? 140 : players.length <= 48 ? 70 : 24
  const candidates = []
  let bestScore = Infinity
  for (let run = 0; run < runs; run++) {
    const teams = Array.from({ length: teamCount }, () => [])
    for (let round = 0; round < playersPerTeam; round++) {
      const group = ordered.slice(round * teamCount, (round + 1) * teamCount)
      const recipients = shuffled([...teams.keys()], random)
      group.forEach((player, index) => teams[recipients[index]].push(player))
    }
    let currentScore = score(teams)
    for (let pass = 0; pass < 12; pass++) {
      let bestSwap = null
      let improved = currentScore - 1e-9
      for (let a = 0; a < teamCount; a++) for (let b = a + 1; b < teamCount; b++) {
        for (let i = 0; i < playersPerTeam; i++) for (let j = 0; j < playersPerTeam; j++) {
          ;[teams[a][i], teams[b][j]] = [teams[b][j], teams[a][i]]
          const candidateScore = score(teams)
          ;[teams[a][i], teams[b][j]] = [teams[b][j], teams[a][i]]
          if (candidateScore < improved || (Math.abs(candidateScore - improved) < 1e-9 && random() < .25)) {
            improved = candidateScore
            bestSwap = [a, b, i, j]
          }
        }
      }
      if (!bestSwap) break
      const [a, b, i, j] = bestSwap
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
