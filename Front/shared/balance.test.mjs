import test from 'node:test'
import assert from 'node:assert/strict'
import { generateBalancedTeams } from './balance.mjs'
const players = [10,9,9,8,8,8,7,7,7,7,6,6,6,5,5,5,4,4,3,3].map((nota,index) => ({ id:index+1, nome:`Jogador ${index+1}`, nota }))
test('every player appears once in equally sized balanced teams', () => {
  const draw = generateBalancedTeams(players,4,5)
  assert.deepEqual(draw.teams.map(team => team.players.length),[5,5,5,5])
  assert.deepEqual(draw.teams.flatMap(team => team.players.map(player => player.id)).sort((a,b)=>a-b),players.map(player=>player.id))
  assert.ok(draw.balanceDifference <= .4,`difference was ${draw.balanceDifference}`)
})
test('reroll keeps balance while changing assignment', () => {
  const first = generateBalancedTeams(players,4,5)
  const second = generateBalancedTeams(players,4,5,{avoidSignature:first.signature})
  assert.notEqual(second.signature,first.signature)
  assert.ok(second.balanceDifference <= first.balanceDifference + .15)
})
test('invalid quantity and missing ratings are rejected', () => {
  assert.throws(()=>generateBalancedTeams(players.slice(1),4,5))
  assert.throws(()=>generateBalancedTeams([{...players[0],nota:null},...players.slice(1)],4,5))
})
test('each position is split as evenly as its player count allows, including rerolls', () => {
  const positions = ['Goleiro', 'Goleiro', 'Goleiro', 'Goleiro', 'Goleiro', 'Defesa', 'Defesa', 'Defesa', 'Lateral', 'Lateral', 'Lateral', 'Meio', 'Meio', 'Meio', 'Meio', 'Meio', 'Ataque', 'Ataque', 'Ataque', 'Ataque']
  const positioned = players.map((player,index)=>({...player,posicao:positions[index]}))
  const first = generateBalancedTeams(positioned,4,5)
  const second = generateBalancedTeams(positioned,4,5,{avoidSignature:first.signature})
  assert.notEqual(first.signature,second.signature)
  for (const draw of [first,second]) {
    for (const position of new Set(positions)) {
      const counts = draw.teams.map(team=>team.players.filter(player=>player.posicao===position).length)
      assert.ok(Math.max(...counts)-Math.min(...counts)<=1,`${position}: ${counts}`)
    }
    assert.ok(draw.balanceDifference<=1,`rating difference was ${draw.balanceDifference}`)
  }
})
test('existing players without positions can still be drawn', () => {
  const mixed = players.map((player,index)=>({...player,posicao:index<5?'Goleiro':''}))
  const draw = generateBalancedTeams(mixed,4,5)
  const keepers = draw.teams.map(team=>team.players.filter(player=>player.posicao==='Goleiro').length)
  assert.ok(Math.max(...keepers)-Math.min(...keepers)<=1)
})
