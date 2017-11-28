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

    GRADE_TEXT_SUCCESS: (state, { payload: { body: { admin }, data: text } }) =>
      state.update(
        'eval',
        texts =>
          admin
            ? texts.map(t => (t.get('id') === text.id ? fromJS(text) : t))
            : texts.filter(t => t.get('id') !== text.id),
      ),
  },
  initialState,
)
