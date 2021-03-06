import { handleActions, createAction } from 'redux-actions'
import { fromJS, List } from 'immutable'

import { initPlayer } from 'helpers/race'
import { computeText } from 'helpers/text'
import typeCharFn from './typeChar'

const initialState = fromJS({
  id: null,
  title: null,
  text: null,
  author: null,
  stars: 0,
  rates: {},
  startAt: null,
  players: [],
  lastRace: null,
  ghost: null,

  // TODO tbh we should use a single "status" string, no?
  isStarted: false,
  isFinished: false,
  isGhosting: false,
})

const handlers = {
  RACE_GHOST: state => state.set('isGhosting', true),
  RACE_INIT: (state, { payload }) => {
    const { raw, ...rest } = payload

    return initialState.merge(
      fromJS({
        ...rest,
        text: computeText(raw),
        players: List([initPlayer()]),
      }),
    )
  },
  RACE_START: state => state.set('isStarted', true).set('startAt', Date.now()),
  RACE_SET_FINISHED: state => state.set('isFinished', true),
  RACE_STOP: (state, { payload: { time, log } }) =>
    state
      .set('isFinished', true)
      .setIn(['players', 0, 'time'], time)
      .setIn(['players', 0, 'log'], log),
  RACE_RESET: state =>
    state
      .set('startAt', 0)
      .set('lastRace', state.get('isStarted') && !state.get('isGhosting') ? state : null)
      .set('isStarted', false)
      .set('isFinished', false)
      .set('isGhosting', false)
      .set('text', computeText(state.getIn(['text', 'raw'])))
      .update('players', players => {
        players = players.set(0, initPlayer())
        if (state.get('ghost')) {
          players = players.set(1, initPlayer())
        }
        return players
      })
      .setIn(['players', 0, 'maxDisplayedLines'], state.getIn(['players', 0, 'maxDisplayedLines']))
      .setIn(['players', 0, 'maxDisplayedCols'], state.getIn(['players', 0, 'maxDisplayedCols'])),
  RACE_TYPE_CHAR: (state, { payload: { charCode, playerIndex } }) =>
    typeCharFn(state, charCode, playerIndex),
  RACE_SET_DIMENSIONS: (state, { payload: { maxDisplayedLines, maxDisplayedCols } }) =>
    state
      .setIn(['players', 0, 'maxDisplayedLines'], maxDisplayedLines)
      .setIn(['players', 0, 'maxDisplayedCols'], maxDisplayedCols),
  SAVE_RACE_SUCCESS: (state, { payload: { data: { leaders } } }) =>
    state.set('leaders', fromJS(leaders)),
  STAR_TEXT_SUCCESS: (state, { payload: { data } }) => {
    const { id, rates, stars } = data
    if (state.get('id') !== id) {
      return state
    }

    return state.set('rates', fromJS(rates)).set('stars', stars)
  },
  RACE_LOAD_GHOST: (state, { payload: ghost }) =>
    state.set('ghost', ghost).update('players', players => players.set(1, initPlayer())),
  RACE_REMOVE_GHOST: state =>
    state.set('ghost', null).update('players', players => players.slice(0, 1)),
}

export default handleActions(handlers, initialState)

// Actions

export const setFinished = createAction('RACE_SET_FINISHED')
export const setGhost = createAction('RACE_GHOST')
export const initRace = createAction('RACE_INIT')
export const typeChar = createAction('RACE_TYPE_CHAR', (charCode, playerIndex) => ({
  charCode,
  playerIndex,
}))
export const startRace = createAction('RACE_START')
export const stopRace = createAction('RACE_STOP')
export const resetRace = createAction('RACE_RESET')
export const setDimensions = createAction('RACE_SET_DIMENSIONS')
export const removeGhost = createAction('RACE_REMOVE_GHOST')

// Selectors

export function getPlayer(state) {
  return state.race.getIn(['players', 0], null)
}

export function getPlayers(state) {
  return state.race.get('players')
}

export function getText(state) {
  return state.race.get('text', null)
}

// WTF why do I need to add this here?
// ....hmmm. Don't care. It works.
if (module.hot) {
  module.hot.accept()
}
