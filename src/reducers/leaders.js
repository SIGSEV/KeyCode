import { handleActions } from 'redux-actions'

const initialState = {}

export default handleActions(
  {
    LOAD_LEADERS_SUCCESS: (state, { payload: { data } }) => data,
  },
  initialState,
)
