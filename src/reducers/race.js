import { handleActions, createAction } from 'redux-actions'
import { fromJS, List } from 'immutable'

import { initPlayer } from 'helpers/race'
import { computeText, countLinesOffset } from 'helpers/text'

const initialState = fromJS({
  id: null,
  title: null,
  text: null,
  stars: 0,
  rates: {},
  isStarted: false,
  isFinished: false,
  players: [],
})

const DISPLAYED_LINES = 15

const handlers = {
  RACE_INIT: (state, { payload }) => {
    const { raw, id, title, rates, stars } = payload

    return initialState
      .set('id', id)
      .set('title', title)
      .set('rates', rates)
      .set('stars', stars)
      .set('text', computeText(raw))
      .set('players', List([initPlayer()]))
  },
  RACE_START: state => state.set('isStarted', true),
  RACE_STOP: (state, { payload: time }) =>
    state.set('isFinished', true).setIn(['players', 0, 'time'], time),
  RACE_RESET: state => {
    return state
      .set('isStarted', false)
      .set('isFinished', false)
      .set('text', computeText(state.getIn(['text', 'raw'])))
      .set('players', List([initPlayer()]))
  },
  RACE_TYPE_CHAR: (state, { payload: char }) => {
    let p = state.getIn(['players', 0])

    const cursor = p.get('cursor')
    const wordIndex = p.get('wordIndex')
    const typedWord = p.get('typedWord')
    const newTypedWord = `${typedWord}${char}`
    const charToType = state.getIn(['text', 'raw'])[cursor]

    if (charToType === char) {
      p = p.update('validKeys', keys => keys.set(char, keys.get(char, 0) + 1))
    } else {
      p = p.update('wrongKeys', keys => keys.set(char, keys.get(char, 0) + 1))
    }

    p = p
      .set('typedChar', char)
      .set('cursor', cursor + 1)
      .set('typedWord', newTypedWord)

    return state.setIn(['players', 0], p).updateIn(['text'], text => {
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

    if (chunks.getIn([wordIndex, 'isWrong'])) {
      p = p.set('wrongWordsCount', p.get('wrongWordsCount', 0) + 1)
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
      .set('typedWord', newTypedWord)
      .set('corrections', p.get('corrections') + 1)
    if (word.get('content').startsWith(newTypedWord)) {
      chunks = chunks.setIn([wordIndex, 'isWrong'], false)
    }
    return state.setIn(['players', 0], p).setIn(['text', 'chunks'], chunks)
  },
  STAR_TEXT_SUCCESS: (state, { payload: { data } }) => {
    const { id, rates, stars } = data
    if (state.get('id') !== id) {
      return state
    }

    return state.set('rates', fromJS(rates)).set('stars', stars)
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
