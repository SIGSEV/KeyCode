import { initRace } from 'reducers/race'

export function loadRace(id) {
  return async dispatch => {
    await new Promise(resolve => setTimeout(resolve, 500))
    // TODO load the race
    const rawURL =
      'https://gist.githubusercontent.com/lief480/15766a8188f01681044d46680df6f2cd/raw/757fb1772d796d3fbe79388558b10fb3f645974e/axios-instance-config.js'

    const r = await fetch(rawURL)
    const text = await r.text()
    dispatch(
      initRace({
        id,
        text,
      }),
    )
  }
}
