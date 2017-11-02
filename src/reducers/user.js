import { handleActions } from 'redux-actions'
import { fromJS } from 'immutable'

const initialState = null

export default handleActions(
  {
    LOGIN: () => {},
  },
  initialState,
)
