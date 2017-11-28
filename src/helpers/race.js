import { fromJS } from 'immutable'
import shortid from 'shortid'

export function initPlayer() {
  return fromJS({
    id: shortid.generate(),
    maxDisplayedLines: 0,
    line: 0,
    cursor: 0,
    scrollY: 0,
    scrollX: 0,
    wordIndex: 0,
    corrections: 0,
    typedWord: '',
    typedChar: null,
    typedWordsCount: 0,
    wrongWordsCount: 0,
    time: 0,
    validKeys: {},
    wrongKeys: {},
    log: '',
  })
}

export const getPayload = race => {
  if (!race) {
    return {}
  }

  const normal = race.toJS()
  if (!normal.players || !normal.players[0]) {
    return {}
  }

  // Assuming p[0] is always logged user
  const {
    id: textId,
    players: [{ time, log, corrections, typedWordsCount, validKeys, wrongKeys, wrongWordsCount }],
  } = normal

  return {
    textId,
    time,
    log,
    corrections,
    typedWordsCount,
    validKeys,
    wrongKeys,
    wrongWordsCount,
  }
}
