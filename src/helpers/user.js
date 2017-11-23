export const getCookie = name => {
  const parts = `; ${document.cookie}`.split(`; ${name}=`)
  return parts.length === 2
    ? parts
        .pop()
        .split(';')
        .shift()
    : null
}

export const removeCookie = name => {
  document.cookie = `${name}=; Max-Age=0`
}
