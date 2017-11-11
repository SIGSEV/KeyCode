import { handleActions } from 'redux-actions'

const initialState = {
  global: [],
  languages: {},
}

export default handleActions(
  {
    LOAD_LEADERS_SUCCESS: (state, { payload: { query, data } }) =>
      query.language
        ? { ...state, languages: { ...state.languages, [query.language]: data } }
        : { ...state, global: data },
  },
  initialState,
)
