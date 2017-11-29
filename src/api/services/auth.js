import passport from 'passport'
import { Strategy } from 'passport-github'
import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'
import compose from 'composable-middleware'
import isString from 'lodash/isString'
import isObject from 'lodash/isObject'

import { updateOrCreate, getUserById } from 'api/services/user'
import { hasStarredShit } from 'api/services/github'
import { saveRace } from 'api/services/race'

const secret = process.env.SEED

export const getToken = req => {
  if (req.headers.sigsev) {
    return req.headers.sigsev
  }
  if (req.cookies && req.cookies.token) {
    return req.cookies.token
  }

  return null
}

const checkJwt = expressJwt({
  secret,
  getToken,
})

const banMsg = 'You are banned, get out.'

export const setUser = () =>
  compose()
    .use((req, res, next) => checkJwt(req, res, () => next()))
    .use(async (req, res, next) => {
      try {
        req.user = await getUserById(req.user.id)
        if (req.user.banned) {
          throw new Error(banMsg)
        }
        return next()
      } catch (e) {
        if (e.message === banMsg) {
          return next(e.message)
        }
        return next()
      }
    })

export const isAuthenticated = () =>
  compose()
    .use(checkJwt)
    .use(async (req, res, next) => {
      try {
        if (!req.user || !req.user.id) {
          throw new Error('You need to be authenticated.')
        }

        req.user = await getUserById(req.user.id)
        if (req.user.banned) {
          throw new Error(banMsg)
        }

        return next()
      } catch (e) {
        return next(e.message)
      }
    })

export const setToken = (req, res) => {
  if (!req.user) {
    return
  }

  const { id } = req.user
  const token = jwt.sign({ id }, secret, { expiresIn: 60 * 60 * 48 })
  res.cookie('token', token)
  res.redirect(`${__URL__}${req.query.redirect}`)
}

export const initPassport = () => {
  passport.use(
    new Strategy(
      {
        clientID: process.env[`GITHUB_ID${__DEV__ ? '_DEV' : ''}`],
        clientSecret: process.env[`GITHUB_SECRET${__DEV__ ? '_DEV' : ''}`],
        scope: ['write:org', 'read:org'],
        failureRedirect: __URL__,
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          if (await hasStarredShit(accessToken)) {
            throw new Error('Please unstar freeCodeCamp before proceeding.')
          }

          const days =
            (Date.now() - new Date(profile._json.created_at).getTime()) / 1000 / 60 / 60 / 24

          const user = await updateOrCreate(
            profile.id,
            profile.username,
            profile._json.avatar_url,
            days > 100 || profile._json.followers >= 10,
            accessToken,
          )

          if (user.banned) {
            throw new Error('You are banned, and you probably deserved it.')
          }

          if (!req.query.save || !isString(req.query.save)) {
            return done(null, user)
          }

          const failSave = JSON.parse(req.query.save)
          if (!isObject(failSave)) {
            throw new Error('Invalid failsave.')
          }

          saveRace(failSave, user)
          done(null, user)
        } catch (e) {
          done(e)
        }
      },
    ),
  )
}
