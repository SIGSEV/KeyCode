import { push } from 'react-router-redux'

import { logout as rawLogout } from 'reducers/user'

export function getMe() {
  return {
    type: 'API:ME',
    payload: {
      url: '/users/me',
    },
  }
}

export function logout() {
  return dispatch => {
    document.cookie = 'token=; Max-Age=0'
    dispatch(rawLogout())
    dispatch(push('/'))
  }
}
