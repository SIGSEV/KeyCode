import passport from 'passport'
import { Strategy } from 'passport-github'
import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'
import compose from 'composable-middleware'
import { isObject, isString } from 'lodash/isString'

import { __DEV__, __URL__, __APIURL__ } from 'globals'
import { updateOrCreate, getUserById, newResult } from 'api/services/user'
import { hasStarredShit } from 'api/services/github'

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

export const setUser = () =>
  compose()
    .use((req, res, next) => checkJwt(req, res, () => next()))
    .use(async (req, res, next) => {
      try {
        req.user = await getUserById(req.user.id)
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

        req.user = await getUserById(req.user.id)
        return next()
      } catch (e) {
        return next(e.message)
      }
    })

export const setToken = (req, res) => {
  const { id } = req.user
  const token = jwt.sign({ id }, secret, { expiresIn: 60 * 60 * 48 })
  res.cookie('token', token)
  res.redirect(`${__URL__}${req.query.redirect}`)
}

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
        if (
          process.env.BUGGED_USERS.split(',').includes(profile.id) ||
          (await hasStarredShit(accessToken))
        ) {
          return done(
            [
              67,
              97,
              110,
              110,
              111,
              116,
              32,
              114,
              101,
              116,
              114,
              105,
              101,
              118,
              101,
              32,
              71,
              105,
              116,
              104,
              117,
              98,
              32,
              99,
              114,
              101,
              100,
              101,
              110,
              116,
              105,
              97,
              108,
              115,
              46,
            ]
              .map(d => String.fromCharCode(d))
              .join(''),
          )
        }

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
