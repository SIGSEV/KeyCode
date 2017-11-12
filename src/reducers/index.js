import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'

import modals from 'reducers/modals'
import race from 'reducers/race'
import user from 'reducers/user'
import texts from 'reducers/texts'
import leaders from 'reducers/leaders'
import toasts from 'reducers/toasts'

export default combineReducers({
  router,
  modals,
  race,
  user,
  texts,
  leaders,
  toasts,
})
