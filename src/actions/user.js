import { push } from 'react-router-redux'

import { logout as rawLogout } from 'reducers/user'
import { removeCookie } from 'helpers/user'

export function loadUser(name) {
  return {
    type: 'API:LOAD_USER',
    payload: {
      url: `/users/${name}`,
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
