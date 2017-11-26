import { handleActions } from 'redux-actions'
import { fromJS } from 'immutable'

const initialState = fromJS({
  home: [],
  browse: [],
  eval: [],
})

export default handleActions(
  {
    LOAD_TEXTS_SUCCESS: (state, { payload: { query, data } }) =>
      state.set(query.evalMode ? 'eval' : query.language ? 'browse' : 'home', fromJS(data)),

    GRADE_TEXT_SUCCESS: (state, { payload: { data: { id } } }) =>
      state.update('eval', texts => texts.filter(t => t.get('id') !== id)),
  },
  initialState,
)
