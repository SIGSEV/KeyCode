import { List } from 'immutable'

import getTypeSplits, { getCursorMap } from 'helpers/getTypeSplits'
import { computeText } from 'helpers/text'
import { initPlayer } from 'helpers/race'

test('getCursorMap should extract current player and others', () => {
  const players = List([initPlayer(), initPlayer()])
  const map = getCursorMap(players)
  expect(map[0].length).toBe(1)
  expect(map[0][0].name).toBe('player')
})

test('should split correctly test with one player, at start', () => {
  const player = initPlayer()
  const players = List([player])
  const chunks = computeText('hello world').get('chunks')
  const splits = getTypeSplits(chunks, players)
  expect(splits).toEqual([
    { text: 'h', type: 'cursor', players: [] },
    { text: 'ello world', type: 'untouched', players: [] },
  ])
})

test('should split correctly test with one player on another word', () => {
  const player = initPlayer()
    .set('cursor', 7)
    .set('wordIndex', 1)
    .set('typedWord', 'w')
  const players = List([player])
  const chunks = computeText('hello world').get('chunks')
  const splits = getTypeSplits(chunks, players)
  expect(splits).toEqual([
    { text: 'hello w', type: 'typed', players: [] },
    { text: 'o', type: 'cursor', players: [] },
    { text: 'rld', type: 'untouched', players: [] },
  ])
})

test('should split with wrong word', () => {
  const player = initPlayer()
    .set('cursor', 7)
    .set('wordIndex', 1)
    .set('typedWord', 'w')
  const players = List([player])
  const chunks = computeText('hello world')
    .get('chunks')
    .setIn([0, 'isWrong'], true)
  const splits = getTypeSplits(chunks, players)
  expect(splits).toEqual([
    { text: 'hello ', type: 'wrong', players: [] },
    { text: 'w', type: 'typed', players: [] },
    { text: 'o', type: 'cursor', players: [] },
    { text: 'rld', type: 'untouched', players: [] },
  ])
})

test('should split with wrong current typed word', () => {
  const player = initPlayer()
    .set('cursor', 2)
    .set('typedWord', 'hA')
  const players = List([player])
  const chunks = computeText('hello world').get('chunks')
  const splits = getTypeSplits(chunks, players)
  expect(splits).toEqual([
    { text: 'h', type: 'typed', players: [] },
    { text: 'e', type: 'hardWrong', players: [] },
    { text: 'l', type: 'cursor', players: [] },
    { text: 'lo world', type: 'untouched', players: [] },
  ])
})

test('should handle two players on different positions', () => {
  const player1 = initPlayer()
    .set('cursor', 7)
    .set('wordIndex', 1)
    .set('typedWord', 'w')
  const player2 = initPlayer()
    .set('cursor', 3)
    .set('typedWord', 'hel')
  const players = List([player1, player2])
  const chunks = computeText('hello world').get('chunks')
  const splits = getTypeSplits(chunks, players)
  expect(splits).toEqual([
    { text: 'hel', type: 'typed', players: [] },
    { text: 'l', type: 'typed', players: [{ name: 'player' }] },
    { text: 'o w', type: 'typed', players: [] },
    { text: 'o', type: 'cursor', players: [] },
    { text: 'rld', type: 'untouched', players: [] },
  ])
})

test('should handle two players on same position', () => {
  const player1 = initPlayer()
    .set('cursor', 7)
    .set('cursor', 7)
    .set('wordIndex', 1)
    .set('typedWord', 'w')
  const player2 = initPlayer()
    .set('cursor', 7)
    .set('cursor', 7)
    .set('wordIndex', 1)
    .set('typedWord', 'w')
  const players = List([player1, player2])
  const chunks = computeText('hello world').get('chunks')
  const splits = getTypeSplits(chunks, players)
  expect(splits).toEqual([
    { text: 'hello w', type: 'typed', players: [] },
    { text: 'o', type: 'cursor', players: [{ name: 'player' }] },
    { text: 'rld', type: 'untouched', players: [] },
  ])
})

test('should handle scrollY', () => {
  const player = initPlayer().set('scrollY', 1)
  const players = List([player])
  const text = `first line
second line
third line`
  const chunks = computeText(text).get('chunks')
  const splits = getTypeSplits(chunks, players)
  expect(splits).toEqual([{ text: 'second line\nthird line', type: 'untouched', players: [] }])
})

test('should handle max lines', () => {
  const player = initPlayer().set('maxDisplayedLines', 1)
  const players = List([player])
  const text = `first line
second line
third line`
  const chunks = computeText(text).get('chunks')
  const splits = getTypeSplits(chunks, players)
  expect(splits).toEqual([
    { text: 'f', type: 'cursor', players: [] },
    { text: 'irst line\n', type: 'untouched', players: [] },
  ])
})
