import { push } from 'react-router-redux'

import { logout as rawLogout } from 'reducers/user'
import { removeCookie } from 'helpers/user'

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
    dispatch(rawLogout())
    dispatch(push('/'))
    removeCookie('token')
  }
}
