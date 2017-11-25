import { handleActions } from 'redux-actions'

export default handleActions(
  {
    LOAD_USER_SUCCESS: (state, { payload: { data } }) => ({
      ...state,
      [data.name]: data,
    }),
  },
  {},
)
