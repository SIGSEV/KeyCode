import { handleActions, createAction } from 'redux-actions'
import { fromJS, List } from 'immutable'

import { initPlayer } from 'helpers/race'
import { computeText, countLinesOffset } from 'helpers/text'

const initialState = fromJS({
  id: null,
  text: null,
  isStarted: false,
  isFinished: false,
  players: [],
})

const DISPLAYED_LINES = 15

const handlers = {
  RACE_INIT: (state, { payload }) => {
    const { text: rawText, id } = payload
    return initialState
      .set('id', id)
      .set('text', computeText(rawText))
      .set('players', List([initPlayer()]))
  },
  RACE_START: state => state.set('isStarted', true),
  RACE_STOP: state => state.set('isFinished', true),
  RACE_RESET: state => {
    return state
      .set('isStarted', false)
      .set('isFinished', false)
      .set('text', computeText(state.getIn(['text', 'raw'])))
      .set('players', List([initPlayer()]))
  },
  RACE_TYPE_CHAR: (state, { payload: char }) => {
    const p = state.getIn(['players', 0])

    const cursor = p.get('cursor')
    const wordIndex = p.get('wordIndex')
    const typedWord = p.get('typedWord')

    const newTypedWord = `${typedWord}${char}`

    return state
      .updateIn(['players', 0], p => {
        return p
          .set('typedChar', char)
          .set('cursor', cursor + 1)
          .set('typedWord', newTypedWord)
      })
      .updateIn(['text'], text => {
        const word = text.getIn(['chunks', wordIndex])
        if (!word.get('content').startsWith(newTypedWord)) {
          text = text.setIn(['chunks', wordIndex, 'isWrong'], true)
        }
        return text
      })
  },
  RACE_NEXT_WORD: state => {
    let chunks = state.getIn(['text', 'chunks'])
    let p = state.getIn(['players', 0])
    const wordIndex = p.get('wordIndex')
    const typedWord = p.get('typedWord')

    const nextWordIndex = chunks.findIndex((w, i) => i > wordIndex && !w.get('empty'))
    const word = chunks.get(wordIndex)
    const jumps = countLinesOffset(chunks, wordIndex, nextWordIndex)

    if (jumps > 0) {
      const scroll = p.get('scroll')
      const nextLine = p.get('line') + jumps
      const linesCount = state.getIn(['text', 'linesCount'])
      p = p.set('line', nextLine)
      const isLowerThanMiddle = nextLine - scroll > DISPLAYED_LINES / 2 - 1
      const isNotEndOfText = linesCount - scroll > DISPLAYED_LINES - 1
      if (isLowerThanMiddle && isNotEndOfText) {
        p = p.set('scroll', scroll + 1)
      }
    }

    if (!typedWord || typedWord.length !== word.get('content').trim().length) {
      chunks = chunks.setIn([wordIndex, 'isWrong'], true)
    }

    p = p.set('typedWordsCount', p.get('typedWordsCount') + 1)

    if (nextWordIndex === -1) {
      p = p.set('cursor', word.get('end') + 1)
    } else {
      const nextWord = chunks.get(nextWordIndex)
      p = p
        .set('wordIndex', nextWordIndex)
        .set('cursor', nextWord.get('start'))
        .set('typedWord', '')
    }

    return state.setIn(['players', 0], p).setIn(['text', 'chunks'], chunks)
  },
  RACE_TYPE_BACKSPACE: state => {
    let chunks = state.getIn(['text', 'chunks'])
    let p = state.getIn(['players', 0])
    const cursor = p.get('cursor')
    const wordIndex = p.get('wordIndex')
    const word = chunks.get(wordIndex)
    if (cursor === word.get('start')) {
      return state
    }
    const typedWord = p.get('typedWord')
    const newTypedWord = typedWord.substr(0, typedWord.length - 1)
    p = p
      .set('cursor', cursor - 1)
      .set('typedWord', 'newTypedWord')
      .set('corrections', p.get('corrections') + 1)
    if (word.get('content').startsWith(newTypedWord)) {
      chunks = chunks.setIn([wordIndex, 'isWrong'], false)
    }
    return state.setIn(['players', 0], p).setIn(['text', 'chunks'], chunks)
  },
}

export default handleActions(handlers, initialState)

// Actions

export const initRace = createAction('RACE_INIT')
export const typeChar = createAction('RACE_TYPE_CHAR')
export const goNextWord = createAction('RACE_NEXT_WORD')
export const typeBackspace = createAction('RACE_TYPE_BACKSPACE')
export const startRace = createAction('RACE_START')
export const stopRace = createAction('RACE_STOP')
export const resetRace = createAction('RACE_RESET')

// Selectors

export function getPlayer(state) {
  return state.race.getIn(['players', 0], null)
}

export function getText(state) {
  return state.race.get('text', null)
}
