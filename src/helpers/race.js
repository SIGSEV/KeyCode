import { fromJS } from 'immutable'
import shortid from 'shortid'

export function initPlayer() {
  return fromJS({
    id: shortid.generate(),
    line: 0,
    cursor: 0,
    scroll: 0,
    wordIndex: 0,
    corrections: 0,
    typedWord: '',
    typedChar: null,
    typedWordsCount: 0,
    wrongWordsCount: 0,
    time: 0,
    validKeys: {},
    wrongKeys: {},
  })
}

export function getStats(player) {
  const time = player.get('time')
  const minuteRatio = time / 60
  const corrections = player.get('corrections')
  const typedWords = player.get('typedWordsCount')
  const wrongWords = player.get('wrongWordsCount')
  const goodWords = typedWords - wrongWords
  const accuracy = goodWords / typedWords
  const wpm = minuteRatio <= 0 ? 0 : Math.round(goodWords * accuracy / minuteRatio) - corrections

  return {
    wrongWords,
    corrections,
    wpm: Math.max(0, wpm),
    score: Math.max(0, wpm - corrections / 4),
  }
}
