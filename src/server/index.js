import express from 'express'
import http from 'http'
import socketIO from 'socket.io'
import fetch from 'node-fetch'
import compression from 'compression'
import path from 'path'
import cookieParser from 'cookie-parser'
import { scheduleJob } from 'node-schedule'

import 'api/init'

import render from 'server/render'
import handleIO from 'server/socket'
import * as globals from 'globals'
import { setUser, initPassport } from 'api/services/auth'
import { refreshLeaderOrgs } from 'api/services/race'

global.fetch = fetch
Object.keys(globals).forEach(key => (global[key] = globals[key]))

initPassport()

if (__PROD__ && !__PREVIEW__ && (process.env.NODE_APP_INSTANCE || 0) < 1) {
  console.log('[cron]   started') // eslint-disable-line
  scheduleJob('42 * * * *', refreshLeaderOrgs)
}

const ASSETS_FOLDER = path.join(__dirname, '../assets')
const DIST_FOLDER = path.join(__dirname, '../../dist')

const app = express()
const server = http.Server(app)
const io = socketIO(server)

const port = process.env.PORT || 3000

const stats = __PROD__ ? require(path.join(DIST_FOLDER, 'stats.json')) : {}

if (__DEV__) {
  require('./webpack')(app)
}

if (__PROD__) {
  app.use(compression())
  app.use('/api', require('api'))
  app.use('/dist', express.static(DIST_FOLDER))
}

app.use(cookieParser())
app.use('/assets', express.static(ASSETS_FOLDER))
app.use(setUser(), render(stats))

server.listen(port, 'localhost', () => {
  console.log(`[server] listening on port ${port} - ${__ENV__}`) // eslint-disable-line no-console
})

handleIO(io)
