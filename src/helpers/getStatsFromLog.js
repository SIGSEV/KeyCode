import { createStore, combineReducers } from 'redux'

import race, { initRace, typeChar } from 'reducers/race'

export default function getStatsFromLog(text, log) {
  const store = createStore(combineReducers({ race }))
  store.dispatch(initRace({ raw: text }))
  log.split(' ').forEach(couple => {
    const [key, ts] = couple.split('|')
    switch (key) {
      case '0':
        break
      case '-1':
        break
      default:
        store.dispatch(typeChar(String.fromCharCode(key)))
    }
  })
  console.log(store.getState())
  return {
    time: 0,
    wpm: 0,
    score: 0,
    corrections: 0,
    wrongWordsCount: 0,
    typedWordsCount: 0,
  }
}
