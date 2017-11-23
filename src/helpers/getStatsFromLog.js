import { createStore, combineReducers } from 'redux'

import race, { initRace, typeChar } from 'reducers/race'
import { getPayload } from 'helpers/race'

export default function getStatsFromLog(text, log) {
  const store = createStore(combineReducers({ race }))
  store.dispatch(initRace({ raw: text }))

  log.split(' ').forEach(couple => {
    const key = Number(couple.split('|')[0])
    store.dispatch(typeChar(key))
  })

  const state = store.getState()
  return getPayload(state.race)
}
