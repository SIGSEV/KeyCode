import { List } from 'immutable'

import getTypeSplits, { getCursorMap } from 'helpers/getTypeSplits'
import { computeText } from 'helpers/text'
import { initPlayer } from 'helpers/race'

test('getCursorMap should extract current player and others', () => {
  const players = List([initPlayer(), initPlayer()])
  const map = getCursorMap(players)
  expect(map[0].length).toBe(2)
  expect(map[0][0].isCurrent).toBe(true)
  expect(map[0][1].isCurrent).toBe(false)
})

test('should split split correctly test with one player, at start', () => {
  const player = initPlayer()
  const players = List([player])
  const chunks = computeText('hello world').get('chunks')
  const splits = getTypeSplits(chunks, players)
  expect(splits).toEqual([
    { text: 'h', type: 'cursor', players: [{ isCurrent: true }] },
    { text: 'ello world', type: 'untouched', players: [] },
  ])
})
