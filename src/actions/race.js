import { push } from 'react-router-redux'

import {
  initRace,
  setFinished,
  resetRace,
  setGhost,
  typeChar,
  goNextWord,
  typeBackspace,
} from 'reducers/race'

import { getPayload } from 'helpers/race'

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

    return dispatch({
      type: 'API:SAVE_RACE',
      payload: {
        url: '/races',
        method: 'POST',
        body: getPayload(race),
      },
    })
  }
}

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

export function ghostRace(log) {
  return async (dispatch, getState) => {
    const { race } = getState()
    if (race.get('isGhosting') || race.get('isStarted')) {
      return
    }

    dispatch(setGhost(true))

    const splits = log.split(' ')

    for (let i = 0; i < splits.length; ++i) {
      const [charCode, time] = splits[i].split('|').map(o => Number(o))
      if (charCode === -1) {
        dispatch(typeBackspace())
      } else if (charCode === 0) {
        dispatch(goNextWord())
      } else {
        dispatch(typeChar(String.fromCharCode(charCode)))
      }

      await wait(time)
    }

    dispatch(setFinished())
    await wait(3e3)
    dispatch(resetRace())
  }
}
