import { handleActions, createAction } from 'redux-actions'

const initialState = null

const handlers = {
  LOGOUT: () => null,
}

export default handleActions(handlers, initialState)

export const logout = createAction('LOGOUT')
