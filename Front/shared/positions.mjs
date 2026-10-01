export const playerPositions = ['Goleiro', 'Defesa', 'Meio', 'Ataque']

export function positionLabel(position) {
  return playerPositions.includes(position) ? position : 'Sem posição'
}
