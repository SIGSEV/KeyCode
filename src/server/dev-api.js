import express from 'express'

import * as globals from 'globals'
import api from 'api'

Object.keys(globals).forEach(key => (global[key] = globals[key]))

const server = express()
const port = process.env.DEV_API_PORT || 3001

server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS,DELETE')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, SIGSEV',
  )
  next()
})

server.use(api)

server.listen(port, () => {
  console.log(`[api]    listening on port ${port}`) // eslint-disable-line no-console
})
