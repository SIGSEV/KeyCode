import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'

import modals from 'reducers/modals'

export default combineReducers({
  router,
  modals,
})
