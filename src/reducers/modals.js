import { createAction, handleActions } from 'redux-actions'

const initialState = {}

const handlers = {
  MODAL_OPEN: (state, { payload: { name, data } }) => ({
    ...state,
    [name]: { data },
  }),
  MODAL_CLOSE: (state, { payload: name }) => ({
    ...state,
    [name]: null,
  }),
}

export default handleActions(handlers, initialState)

export const openModal = createAction('MODAL_OPEN', (name, data) => ({ name, data }))
export const closeModal = createAction('MODAL_CLOSE', name => name)

export const isModalOpened = (state, name) => !!state.modals[name]
export const getModalData = (state, name) => (!state.modals[name] ? null : state.modals[name].data)
export const hasModal = state => {
  for (const i in state.modals) {
    if (state.modals.hasOwnProperty(i) && !!state.modals[i]) {
      return true
    }
  }
  return false
}
