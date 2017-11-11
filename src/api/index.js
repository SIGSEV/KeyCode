import express from 'express'
import fetch from 'node-fetch'
import passport from 'passport'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

import 'api/init'

import writeLogo from 'logos/write-logo'
import { getAllUsers } from 'api/services/user'
import { setUser, setToken, isAuthenticated } from 'api/services/auth'
import { saveRace, getLeaderboard } from 'api/services/race'
import {
  deleteText,
  getText,
  getTexts,
  getRandomText,
  voteText,
  createText,
} from 'api/services/text'

global.fetch = fetch

const api = express.Router()

api.use(bodyParser.json())
api.use(cookieParser())

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
 * Races
 */

api.post('/races', isAuthenticated(), async (req, res) => {
  try {
    await saveRace(req.body, req.user)
    res.status(200).send({})
  } catch ({ message }) {
    res.status(500).send({ message })
  }
})

/**
 * Texts
 */

api.post('/texts', setUser(), async (req, res) => {
  const { raw, language, title } = req.body
  if (!raw || !language || !title) {
    return res.status(500).send({ message: 'content!!!' })
  }

  try {
    res.send(
      await createText({
        raw,
        language: language.toLowerCase(),
        title,
        author: req.user ? req.user._id : null,
      }),
    )
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

api.delete('/texts/:id', isAuthenticated(), async (req, res) => {
  try {
    res.send(await deleteText(req.params.id, req.user))
  } catch ({ message }) {
    res.status(500).send({ message })
  }
})

api.get('/texts', async (req, res) => {
  try {
    res.send(await getTexts((req.query.language || '').toLowerCase()))
  } catch ({ message }) {
    res.status(500).send({ message })
  }
})

/**
 * Leaderboard
 */

api.get('/leaderboard', async (req, res) => {
  try {
    res.send(await getLeaderboard((req.query.language || '').toLowerCase()))
  } catch ({ message }) {
    res.status(500).send({ message })
  }
})

/**
 * Auth
 */

api.get('/auth', (req, res, next) => {
  const redirect = encodeURIComponent(req.query.redirect)
  const params = {
    state: req.query.data,
    callbackURL: `${__APIURL__}/auth/callback?redirect=${redirect}${req.query.save
      ? `&save=${req.query.save}`
      : ''}`,
  }
  passport.authenticate('github', params)(req, res, next)
})

api.get(
  '/auth/callback',
  passport.authenticate('github', {
    session: false,
  }),
  setToken,
)

/**
 * Logos
 */
api.post('/write-logo', async (req, res) => {
  if (__DEV__) {
    await writeLogo(req.body)
    return res.send(200, 'ok')
  }
  res.send(401, 'l0l we got a h4ck3r h3r3')
})

export default api
