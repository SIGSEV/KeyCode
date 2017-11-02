export function getMe() {
  return {
    type: 'API:ME',
    payload: {
      url: '/users/me',
    },
  }
}
