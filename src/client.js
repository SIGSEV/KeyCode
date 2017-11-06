import React from 'react'
import io from 'socket.io-client'
import { hydrate } from 'react-dom'
import { ConnectedRouter } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import { AppContainer } from 'react-hot-loader'

import createStore from 'store'
import immutablifyState from 'immutablify-state'
import handleSocket from 'handle-socket'

import App from 'components/App'

const history = createHistory()
let socket = io.connect(__URL__)
const state = immutablifyState(window.__INITIAL_STATE__)
const store = createStore(history, state)

handleSocket(socket, store)

const render = Component => {
  hydrate(
    <AppContainer>{Component(store, ConnectedRouter, { history })}</AppContainer>,
    document.getElementById('root'),
  )
}

render(App)

if (module.hot) {
  module.hot.accept('components/App', () => {
    const nextApp = require('components/App')
    render(nextApp)
  })

  module.hot.accept('handle-socket', () => {
    socket.close()
    socket = io.connect(__URL__)
    const nextHandleSocket = require('handle-socket')
    nextHandleSocket(socket, store)
  })
}
