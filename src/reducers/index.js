import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'

import modals from 'reducers/modals'
import race from 'reducers/race'
import user from 'reducers/user'
import texts from 'reducers/texts'

export default combineReducers({
  router,
  modals,
  race,
  user,
  texts,
})
