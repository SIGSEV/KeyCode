import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'

import modals from 'reducers/modals'
import race from 'reducers/race'

export default combineReducers({
  router,
  modals,
  race,
})
