import { push } from 'react-router-redux'

import { initRace } from 'reducers/race'

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

export function saveRace(time) {
  return (dispatch, getState) => {
    const { user, race } = getState()
    if (!user) {
      return
    }

    // Assuming p[0] is always logged user
    const {
      id: textId,
      players: [{ corrections, typedWordsCount, validKeys, wrongKeys, wrongWordsCount }],
    } = race.toJS()

    dispatch({
      type: 'API:SAVE_RACE',
      payload: {
        url: '/races',
        method: 'POST',
        body: {
          textId,
          time,
          corrections,
          typedWordsCount,
          validKeys,
          wrongKeys,
          wrongWordsCount,
        },
      },
    })
  }
}
