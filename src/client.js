import React from 'react'
import { hydrate, render } from 'react-dom'
import { ConnectedRouter } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import { AppContainer } from 'react-hot-loader'
import get from 'lodash/get'
import ReactGA from 'react-ga'

import createStore from 'store'
import immutablifyState from 'immutablify-state'
import { ghostBuster } from 'actions/race'
import { resetRace } from 'reducers/race'
import { getCookie, removeCookie } from 'helpers/user'
import { addToast } from 'reducers/toasts'
import { initSocket } from 'socket'

import App from 'components/App'

const history = createHistory()
const state = immutablifyState(window.__INITIAL_STATE__)
const store = createStore(history, state)

initSocket(store, get(state, 'user.jwt'))

if (__PROD__) {
  ReactGA.initialize('UA-110576183-1')
}

const track = () => {
  if (__PROD__) {
    ReactGA.pageview(`${window.location.pathname}${window.location.search}`)
  }
}

track()

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
}
