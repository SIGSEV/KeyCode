import { fromJS } from 'immutable'

const immutableReducers = ['race']

export default function immutablifyState(state) {
  for (const i in state) {
    if (state.hasOwnProperty(i)) {
      if (immutableReducers.indexOf(i) > -1) {
        state[i] = fromJS(state[i])
      }
    }
  }
  return state
}
