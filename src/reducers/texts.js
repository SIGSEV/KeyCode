import { handleActions } from 'redux-actions'
import { fromJS } from 'immutable'

const initialState = fromJS({
  home: [],
  browse: [],
})

export default handleActions(
  {
    LOAD_TEXTS_SUCCESS: (state, { payload: { query, data } }) =>
      state.set(query.language ? 'browse' : 'home', fromJS(data)),
  },
  initialState,
)
