import express from 'express'
import fetch from 'node-fetch'
import passport from 'passport'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

import 'api/init'

import writeLogo from 'logos/write-logo'
import { getUser, updateUser, banUser } from 'api/services/user'
import { setUser, setToken, isAuthenticated } from 'api/services/auth'
import { saveRace, getLeaderboards } from 'api/services/race'
import populateUser from 'api/populateUser'
import {
  deleteText,
  getText,
  getTexts,
  getRandomText,
  starText,
  createText,
  gradeText,
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

api.delete('/users/:name', isAuthenticated(), async (req, res) => {
  try {
    if (!req.user.admin) {
      throw new Error('You want a ban too?')
    }

    res.send(await banUser(req.params.name))
  } catch ({ message }) {
    res.status(500).send({ message })
  }
})

api.get('/users/:name', async (req, res) => {
  try {
    res.send(await getUser(req.params.name))
  } catch ({ message }) {
    res.status(500).send({ message })
  }
})

api.put('/users/me', isAuthenticated(), async (req, res) => {
  try {
    res.send(await updateUser(req.user, req.body))
  } catch ({ message }) {
    res.status(500).send({ message })
  }
})

/**
 * Races
 */

api.post('/races', isAuthenticated(), populateUser, async (req, res) => {
  try {
    res.send(await saveRace(req.body, req.user))
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

api.put('/texts/:id/grade', isAuthenticated(), async (req, res) => {
  try {
    res.send(await gradeText(req.params.id, req.body.grade, req.user))
  } catch ({ message }) {
    res.status(500).send({ message })
  }
})

api.put('/texts/:id/star', isAuthenticated(), async (req, res) => {
  try {
    res.send(await starText(req.params.id, req.user._id.toString()))
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

api.get('/texts', setUser(), async (req, res) => {
  try {
    res.send(await getTexts(req.query, req.user))
  } catch ({ message }) {
    res.status(500).send({ message })
  }
})

/**
 * Leaderboard
 */

api.get('/leaderboard', async (req, res) => {
  try {
    res.send(await getLeaderboards())
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
    callbackURL: `${__APIURL__}/auth/callback?redirect=${redirect}${
      req.query.save ? `&save=${req.query.save}` : ''
    }`,
  }

  passport.authenticate('github', params)(req, res, next)
})

api.get(
  '/auth/callback',
  (req, res, next) => {
    passport.authenticate('github', {
      session: false,
    })(req, res, e => {
      if (!e) {
        return next()
      }

      res.cookie('SIGERR', e.message)
      res.redirect(__URL__)
      next()
    })
  },

  setToken,
)

/**
 * Logos
 */
api.post('/write-logo', async (req, res) => {
  if (__DEV__) {
    await writeLogo(req.body)
    return res.status(200).end()
  }

  res.status(401).send('l0l we got a h4ck3r h3r3')
})

export default api
