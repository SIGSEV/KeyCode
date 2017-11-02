import express from 'express'
import fetch from 'node-fetch'
import passport from 'passport'

import 'api/init'

import { getAll } from 'api/services/user'
import { setToken, isAuthenticated } from 'api/services/auth'

const api = express.Router()

const GITHUB_BASE = 'https://api.github.com/graphql'

api.post('/graphql', async (req, res) => {
  try {
    const r = await fetch(GITHUB_BASE, {
      method: 'POST',
      body: JSON.stringify(req.body),
      headers: {
        Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
      },
    })
    const json = await r.json()
    res.send(json)
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
})

api.get('/users', async (req, res) => {
  try {
    res.send(await getAll())
  } catch ({ message }) {
    res.status(500).send({ message })
  }
})

api.get('/users/me', isAuthenticated(), (req, res) => res.send(req.user))

api.get('/texts', (req, res) => {
  try {
    res.send([
      `var Ma_premiere__FN = function()  { 
     return "1" + [];
};;`,
    ])
  } catch ({ message }) {
    res.status(500).send({ message })
  }
})

api.get('/auth', (req, res, next) => {
  passport.authenticate('github', { state: req.query.data })(req, res, next)
})

api.get(
  '/auth/callback',
  passport.authenticate('github', {
    session: false,
  }),
  setToken,
)

export default api
