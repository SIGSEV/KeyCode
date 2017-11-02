import express from 'express'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import path from 'path'

import 'api/init'

import render from 'server/render'
import * as globals from 'globals'
import { setUser } from 'api/services/auth'

Object.keys(globals).forEach(key => (global[key] = globals[key]))

const ASSETS_FOLDER = path.join(__dirname, '../assets')
const DIST_FOLDER = path.join(__dirname, '../../dist')

const server = express()
const port = process.env.PORT || 3000

const stats = __PROD__ ? require(path.join(DIST_FOLDER, 'stats.json')) : {}

if (__DEV__) {
  require('./webpack')(server)
}

if (__PROD__) {
  server.use(compression())
  server.use('/api', require('api'))
  server.use('/dist', express.static(DIST_FOLDER))
}

server.use(cookieParser())
server.use('/assets', express.static(ASSETS_FOLDER))
server.use(setUser(), render(stats))

server.listen(port, 'localhost', () => {
  console.log(`[server] listening on port ${port} - ${__ENV__}`) // eslint-disable-line no-console
})
