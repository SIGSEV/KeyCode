import { handleActions, createAction } from 'redux-actions'
import { generate as shortid } from 'shortid'

export const removeToast = createAction('REMOVE_TOAST')

export const addToast = (msg, type) => dispatch => {
  const id = shortid()

  dispatch({ type: 'ADD_TOAST', payload: { msg, type, id } })

  setTimeout(() => dispatch(removeToast(id)), 10e3)
}

export default handleActions(
  {
    ADD_TOAST: (state, { payload: toast }) => ({ ...state, [toast.id]: toast }),

    REMOVE_TOAST: (state, { payload: id }) =>
      Object.keys(state)
        .filter(k => k !== id)
        .reduce((acc, k) => ((acc[k] = state[k]), acc), {}),
  },
  {},
)
