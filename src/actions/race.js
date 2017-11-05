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
