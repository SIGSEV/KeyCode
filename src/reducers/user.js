import { handleActions, createAction } from 'redux-actions'

const initialState = null

const handlers = {
  LOGOUT: () => null,
  UPDATE_USER_SUCCESS: (state, { payload: { data } }) => ({ ...data, jwt: state.jwt }),
}

export default handleActions(handlers, initialState)

export const logout = createAction('LOGOUT')
