import { renderToString } from 'react-dom/server'
import { ServerStyleSheet } from 'styled-components'
import { StaticRouter } from 'react-router'
import { matchPath } from 'react-router-dom'

import routes from 'routes'
import createStore from 'store'
import page from 'server/page'
import { getToken } from 'api/services/auth'

import App from 'components/App'

export default stats => async (req, res) => {
  try {
    const store = createStore(null, { user: { ...req.user.toObject(), jwt: getToken(req) } })
    const sheet = new ServerStyleSheet()

    const context = {}
    const promises = []

    routes.some(route => {
      const match = matchPath(req.url, route)
      if (match && route.load) {
        promises.push(
          route.load(store, {
            // TODO: give real react-router params
            url: req.url,
          }),
        )
      }
      return match
    })

    await Promise.all(promises)

    const root = App(store, StaticRouter, { location: req.url, context })
    const html = __DEV__ ? '' : renderToString(sheet.collectStyles(root))
    const styles = __DEV__ ? '' : sheet.getStyleTags()

    res.end(page({ styles, html, state: store.getState(), main: stats.main || 'bundle.js' }))
  } catch (err) {
    res.status(500).send(err.stack)
  }
}
