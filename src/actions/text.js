export function createText(body) {
  return {
    type: 'API:TEXT_CREATE',
    payload: {
      url: '/texts',
      method: 'POST',
      body,
    },
  }
}
