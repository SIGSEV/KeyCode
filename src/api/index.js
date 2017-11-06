import express from 'express'
import fetch from 'node-fetch'
import passport from 'passport'

import 'api/init'

import { getAllUsers } from 'api/services/user'
import { getText, getTexts, getRandomText, voteText, createText } from 'api/services/text'
import { setToken, isAuthenticated } from 'api/services/auth'

global.fetch = fetch

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

/**
 * Users
 */

api.get('/users', async (req, res) => {
  try {
    res.send(await getAllUsers())
  } catch ({ message }) {
    res.status(500).send({ message })
  }
})

api.get('/users/me', isAuthenticated(), (req, res) => res.send(req.user))

/**
 * Texts
 */

api.post('/texts', isAuthenticated(), async (req, res) => {
  const { raw, language, title } = req.body
  if (!raw || !language || !title) {
    return res.status(500).send({ message: 'content!!!' })
  }

  try {
    res.send(await createText({ raw, language, title, author: req.user._id }))
  } catch ({ message }) {
    res.status(500).send({ message })
  }
})

api.put('/texts/:id/star', isAuthenticated(), async (req, res) => {
  try {
    res.send(await voteText(req.params.id, req.user._id.toString()))
  } catch ({ message }) {
    res.status(500).send({ message })
  }
})

api.get('/texts/random', async (req, res) => {
  try {
    res.send(await getRandomText())
  } catch ({ message }) {
    res.status(500).send({ message })
  }
})

api.get('/texts/:id', async (req, res) => {
  try {
    res.send(await getText(req.params.id))
  } catch ({ message }) {
    res.status(500).send({ message })
  }
})

api.get('/texts', async (req, res) => {
  try {
    res.send(await getTexts(req.query.language))
  } catch ({ message }) {
    res.status(500).send({ message })
  }
})

/**
 * Auth
 */

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
