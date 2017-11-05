export default store => next => async action => {
  const isGraphql = action.type.startsWith('G:')
  const isAPI = action.type.startsWith('API:')

  if (!isAPI && !isGraphql) {
    return next(action)
  }

  const { dispatch, getState } = store
  const prefix = action.type.split(':')[1]

  let { url = '', body, method = 'GET' } = action.payload

  if (isGraphql) {
    method = 'POST'
    url = '/graphql'
  }

  url = `${__APIURL__}${url}`

  const headers = {
    Accept: 'application/json',
    SIGSEV: getState().user.token,
    'Content-Type': 'application/json',
  }

  if (body) {
    body = JSON.stringify(body)
  }

  try {
    dispatch({ type: `${prefix}_START` })
    const payload = { method, headers, body }
    const data = await fetch(url, payload).then(d => d.json())
    dispatch({ type: `${prefix}_SUCCESS`, payload: { data } })
    return data
  } catch (err) {
    dispatch({ type: `${prefix}_ERROR` })
    throw new Error(err)
  }
}
