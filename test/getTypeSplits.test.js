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

test('should split correctly test with one player, at start', () => {
  const player = initPlayer()
  const players = List([player])
  const chunks = computeText('hello world').get('chunks')
  const splits = getTypeSplits(chunks, players)
  expect(splits).toEqual([
    { text: 'h', type: 'cursor', players: [{ isCurrent: true }] },
    { text: 'ello world', type: 'untouched', players: [] },
  ])
})

test('should split correctly test with one player on another word', () => {
  const player = initPlayer().set('cursor', 7)
  const players = List([player])
  const chunks = computeText('hello world').get('chunks')
  const splits = getTypeSplits(chunks, players)
  expect(splits).toEqual([
    { text: 'hello w', type: 'typed', players: [] },
    { text: 'o', type: 'cursor', players: [{ isCurrent: true }] },
    { text: 'rld', type: 'untouched', players: [] },
  ])
})

test('should split with wrong word', () => {
  const player = initPlayer().set('cursor', 7)
  const players = List([player])
  const chunks = computeText('hello world')
    .get('chunks')
    .setIn([0, 'isWrong'], true)
  const splits = getTypeSplits(chunks, players)
  expect(splits).toEqual([
    { text: 'hello ', type: 'wrong', players: [] },
    { text: 'w', type: 'typed', players: [] },
    { text: 'o', type: 'cursor', players: [{ isCurrent: true }] },
    { text: 'rld', type: 'untouched', players: [] },
  ])
})

test('should handle two players on different positions', () => {
  const player1 = initPlayer().set('cursor', 7)
  const player2 = initPlayer().set('cursor', 3)
  const players = List([player1, player2])
  const chunks = computeText('hello world').get('chunks')
  const splits = getTypeSplits(chunks, players)
  expect(splits).toEqual([
    { text: 'hel', type: 'typed', players: [] },
    { text: 'l', type: 'typed', players: [{ isCurrent: false }] },
    { text: 'o w', type: 'typed', players: [] },
    { text: 'o', type: 'cursor', players: [{ isCurrent: true }] },
    { text: 'rld', type: 'untouched', players: [] },
  ])
})

test('should handle two players on same position', () => {
  const player1 = initPlayer().set('cursor', 7)
  const player2 = initPlayer().set('cursor', 7)
  const players = List([player1, player2])
  const chunks = computeText('hello world').get('chunks')
  const splits = getTypeSplits(chunks, players)
  expect(splits).toEqual([
    { text: 'hello w', type: 'typed', players: [] },
    { text: 'o', type: 'cursor', players: [{ isCurrent: true }, { isCurrent: false }] },
    { text: 'rld', type: 'untouched', players: [] },
  ])
})
