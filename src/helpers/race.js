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

export const getPayload = race => {
  // Assuming p[0] is always logged user
  const {
    id: textId,
    players: [{ time, corrections, typedWordsCount, validKeys, wrongKeys, wrongWordsCount }],
  } = race.toJS()

  return {
    textId,
    time,
    corrections,
    typedWordsCount,
    validKeys,
    wrongKeys,
    wrongWordsCount,
  }
}

export function getStats(base) {
  const time = base.get('time')
  const minuteRatio = time / 60
  const corrections = base.get('corrections')
  const typedWords = base.get('typedWordsCount')
  const wrongWords = base.get('wrongWordsCount')
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
