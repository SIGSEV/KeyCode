import passport from 'passport'
import { Strategy } from 'passport-github'
import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'
import compose from 'composable-middleware'
import { isObject, isString } from 'lodash/isString'

import { __URL__, __APIURL__ } from 'globals'
import { updateOrCreate, getById, newResult } from 'api/services/user'

const secret = process.env.SEED

const checkJwt = expressJwt({
  secret,
  credentialsRequired: false,
  getToken: req => {
    if (req.headers.authorization && req.headers.authorization) {
      return req.headers.authorization
    }
    if (req.cookies && req.cookies.token) {
      return req.cookies.token
    }

    return null
  },
})

export const setUser = () =>
  compose()
    .use(checkJwt)
    .use(async (req, res, next) => {
      try {
        req.user = await getById(req.user.id)
        return next()
      } catch (e) {
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

        req.user = await getById(req.user.id)
        return next()
      } catch (e) {
        return next(e.message)
      }
    })

export const setToken = (req, res) => {
  const { id } = req.user
  const token = jwt.sign({ id }, secret, { expiresIn: 60 * 60 * 48 })

  res.cookie('token', token)
  res.redirect(__URL__)
}

passport.use(
  new Strategy(
    {
      clientID: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: `${__APIURL__}/auth/callback`,
      scope: ['write:org', 'read:org'],
      failureRedirect: __URL__,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const user = await updateOrCreate(
          profile.id,
          profile.username,
          profile._json.avatar_url,
          accessToken,
        )

        if (!req.query.state || !isString(req.query.state)) {
          return done(null, user)
        }

        const failsave = JSON.parse(req.query.state)
        if (!isObject(failsave)) {
          throw new Error('Invalid failsave.')
        }

        failsave.userId = user.id

        newResult(failsave)
        done(null, user)
      } catch (e) {
        done(e)
      }
    },
  ),
)
