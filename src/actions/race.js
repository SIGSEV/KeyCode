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

    dispatch(
      initRace({
        id,
        text: text.raw,
      }),
    )
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

    const { id, raw } = text

    dispatch(
      initRace({
        id,
        text: raw,
      }),
    )

    dispatch(push(`/r/${id}`))
  }
}
