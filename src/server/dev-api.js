import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

import api from 'api'

const server = express()
const port = process.env.DEV_API_PORT || 3001

server.use(bodyParser.json())
server.use(cookieParser())

server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  next()
})

server.use(api)

server.listen(port, () => {
  console.log(`[api]    listening on port ${port}`) // eslint-disable-line no-console
})
