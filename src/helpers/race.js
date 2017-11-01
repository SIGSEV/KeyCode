import { Map } from 'immutable'
import shortid from 'shortid'

export function initPlayer() {
  return Map({
    id: shortid.generate(),
    line: 0,
    cursor: 0,
    scroll: 0,
    wordIndex: 0,
    corrections: 0,
    typedWord: '',
    typedChar: null,
    typedWordsCount: 0,
  })
}
