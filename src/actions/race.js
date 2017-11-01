import { initRace } from 'reducers/race'

export function loadRace(id) {
  return dispatch => {
    console.log(`>>> loading race ${id}`)
    dispatch(
      initRace({
        id,
        text: 'hey there',
      }),
    )
  }
}
