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

export function updateUser(body) {
  return {
    type: 'API:UPDATE_USER',
    payload: {
      url: '/users/me',
      method: 'PUT',
      body,
    },
  }
}

export function banUser(name) {
  return {
    type: 'API:BAN_USER',
    payload: {
      url: `/users/${name}`,
      method: 'DELETE',
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
