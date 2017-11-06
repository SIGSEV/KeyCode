import qs from 'query-string'

export default store => next => async action => {
  const isGraphql = action.type.startsWith('G:')
  const isAPI = action.type.startsWith('API:')

  if (!isAPI && !isGraphql) {
    return next(action)
  }

  const { dispatch, getState } = store
  const prefix = action.type.split(':')[1]
  const state = getState()

  let { url = '', body, method = 'GET' } = action.payload
  const { query } = action.payload

  if (isGraphql) {
    method = 'POST'
    url = '/graphql'
  }

  url = `${__APIURL__}${url}${query ? '?' : ''}${qs.stringify(query || {})}`

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }

  if (state.user && state.user.jwt) {
    headers.SIGSEV = state.user.jwt
  }

  if (body) {
    body = JSON.stringify(body)
  }

  try {
    dispatch({ type: `${prefix}_START` })
    const payload = { method, headers, body }
    const data = await fetch(url, payload).then(d => d.json())
    dispatch({ type: `${prefix}_SUCCESS`, payload: { ...payload, query, data } })
    return data
  } catch (err) {
    dispatch({ type: `${prefix}_ERROR` })
    throw new Error(err)
  }
}
