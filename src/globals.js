const { NODE_ENV, PREVIEW } = process.env

export const __BROWSER__ = false
export const __PREVIEW__ = !!PREVIEW
export const __ENV__ = NODE_ENV || 'development'
export const __DEV__ = __ENV__ === 'development'
export const __PROD__ = __ENV__ === 'production'

export const __APIURL__ = __DEV__
  ? 'http://localhost:3001'
  : __PREVIEW__ ? 'http://localhost:3000/api' : 'https://keycode.sigsev.io/api'

export const __URL__ =
  __DEV__ || __PREVIEW__ ? 'http://localhost:3000' : 'https://keycode.sigsev.io'
