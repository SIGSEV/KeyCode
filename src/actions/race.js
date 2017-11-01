import { initRace } from 'reducers/race'

export function loadRace(id) {
  return async dispatch => {
    await new Promise(resolve => setTimeout(resolve, 1e3))
    // TODO load the race
    dispatch(
      initRace({
        id,
        text: 'hey there blabaoentuhason thasontu hasoentuhason thasoetn',
      }),
    )
  }
}
