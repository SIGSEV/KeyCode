import { push } from 'react-router-redux'

import { initRace, setFinished, resetRace, setGhost, typeChar } from 'reducers/race'

import { getPayload } from 'helpers/race'
import getScore from 'helpers/getScore'
import { deserializeLog } from 'helpers/log'

export function loadRace(id) {
  return async dispatch => {
    const text = await dispatch({
      type: 'API:TEXT_LOAD',
      payload: {
        url: `/texts/${id}`,
      },
    })

    dispatch(initRace(text))
  }
}

export function loadRandom() {
  return async dispatch => {
    const text = await dispatch({
      type: 'API:RANDOM_TEXT',
      payload: {
        url: '/texts/random',
      },
    })

    dispatch(initRace(text))
    dispatch(push(`/r/${text.id}`))
  }
}

export function saveRace() {
  return (dispatch, getState) => {
    const { user, race } = getState()
    if (!user) {
      return
    }

    const payload = getPayload(race)
    const { score, wpm } = getScore(payload)

    return dispatch({
      type: 'API:SAVE_RACE',
      payload: {
        url: '/races',
        method: 'POST',
        body: { ...payload, wpm, score },
      },
    })
  }
}

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

let ghostBustered = false

export const ghostBuster = () => (ghostBustered = true)

export function loadGhost(rawGhost) {
  const richLog = deserializeLog(rawGhost.get('log'))
  const ghost = rawGhost.set('richLog', richLog)
  return dispatch =>
    dispatch({
      type: 'RACE_LOAD_GHOST',
      payload: ghost,
    })
}

export function ghostRace(log) {
  return async (dispatch, getState) => {
    const { race } = getState()
    if (race.get('isGhosting') || race.get('isStarted')) {
      return
    }

    ghostBustered = false

    dispatch(setGhost(true))

    const splits = log.split(' ')

    for (let i = 0; i < splits.length; ++i) {
      if (ghostBustered) {
        break
      }

      const [charCode, time] = splits[i].split('|').map(o => Number(o))
      const beforeDispatch = Date.now()
      dispatch(typeChar(charCode))
      const delta = Date.now() - beforeDispatch

      await wait(time - delta)
    }

    if (ghostBustered) {
      return
    }

    dispatch(setFinished())
    await wait(3e3)
    dispatch(resetRace())
  }
}

if (module.hot) {
  module.hot.accept()
}
