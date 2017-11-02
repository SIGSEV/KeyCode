const getCookie = name => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)

  if (parts.length === 2) {
    return parts
      .pop()
      .split(';')
      .shift()
  }
}

export default store => next => async action => {
  const isGraphql = action.type.startsWith('G:')
  const isAPI = action.type.startsWith('API:')

  if (!isAPI && !isGraphql) {
    return next(action)
  }

  const { dispatch } = store
  const prefix = action.type.split(':')[1]

  let { url = '', body, method = 'GET' } = action.payload

  if (isGraphql) {
    method = 'POST'
    url = '/graphql'
  }

  url = `${__APIURL__}${url}`

  const headers = {
    Accept: 'application/json',
    Authorization: getCookie('token'),
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
  } catch (err) {
    dispatch({ type: `${prefix}_ERROR` })
    throw new Error(err)
  }
}
