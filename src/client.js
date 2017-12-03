import React from 'react'
import io from 'socket.io-client'
import { hydrate, render } from 'react-dom'
import { ConnectedRouter } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import { AppContainer } from 'react-hot-loader'
import ReactGA from 'react-ga'

import createStore from 'store'
import immutablifyState from 'immutablify-state'
import handleSocket from 'handle-socket'
import { ghostBuster } from 'actions/race'
import { resetRace } from 'reducers/race'
import { getCookie, removeCookie } from 'helpers/user'
import { addToast } from 'reducers/toasts'

import App from 'components/App'

const history = createHistory()
let socket = io.connect(__URL__)
const state = immutablifyState(window.__INITIAL_STATE__)
const store = createStore(history, state)

if (__PROD__) {
  ReactGA.initialize('UA-110576183-1')
}

const track = () => {
  if (__PROD__) {
    ReactGA.pageview(`${window.location.pathname}${window.location.search}`)
  }
}

track()
ReactGA.pageview()

history.listen(() => {
  track()
  ghostBuster()
  store.dispatch(resetRace())
})

const err = getCookie('SIGERR')
if (err) {
  store.dispatch(addToast(decodeURIComponent(err), 'error'))
  removeCookie('SIGERR')
}

handleSocket(socket, store)

const r = Component => {
  ;(__DEV__ ? render : hydrate)(
    <AppContainer>{Component(store, ConnectedRouter, { history })}</AppContainer>,
    document.getElementById('root'),
  )
}

r(App)

if (module.hot) {
  module.hot.accept('components/App', () => {
    const nextApp = require('components/App')
    r(nextApp)
  })

  module.hot.accept('handle-socket', () => {
    socket.close()
    socket = io.connect(__URL__)
    const nextHandleSocket = require('handle-socket')
    nextHandleSocket(socket, store)
  })
}
