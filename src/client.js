import React from 'react'
import { hydrate } from 'react-dom'
import { ConnectedRouter } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import { AppContainer } from 'react-hot-loader'

import createStore from 'store'
import immutablifyState from 'immutablify-state'

import App from 'components/App'

const history = createHistory()

const state = immutablifyState(window.__INITIAL_STATE__)
const store = createStore(history, state)

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
}
