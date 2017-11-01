import { initRace } from 'reducers/race'

import dummyText from 'assets/dummy-text'

export function loadRace(id) {
  return async dispatch => {
    await new Promise(resolve => setTimeout(resolve, 1e3))
    // TODO load the race
    dispatch(
      initRace({
        id,
        text: dummyText,
      }),
    )
  }
}
