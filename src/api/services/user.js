import User from 'api/models/user'
import Race from 'api/models/race'

import { removeUserFromOrg, getOrgs } from 'api/services/github'

export const getUsersCount = () => User.count()
export const getAllUsers = () => User.findAll()
export const getUserById = id => User.findById(id)
export const getByGithub = githubId => User.findOne({ githubId })

const getByName = name => User.findOne({ name }, '-token')

export const updateOrCreate = async (githubId, name, avatar, verified, token) => {
  const user = await getByGithub(githubId)

  if (!user) {
    return User.create({ githubId, name, avatar, verified, token })
  }

  user.set({ name, avatar, verified, token })
  return user.save()
}

export const updateUser = (user, body) => {
  if (body.staggered) {
    user.staggered = body.staggered
  }

  if (body.layout) {
    user.layout = body.layout
  }

  if (user.layout === 'qwerty') {
    user.staggered = true
  }

  return user.save()
}

export const banUser = async name => {
  const user = await getByName(name)

  if (user.admin) {
    throw new Error('Cannot ban an admin.')
  }

  if (__PROD__ && user.currentOrg) {
    await removeUserFromOrg(name, user.currentOrg)
  }

  await Race.update({ user: user._id }, { hidden: true }, { multi: true })

  user.banned = true
  return user.save()
}

export const getUser = async name => {
  const user = (await getByName(name)).toObject()
  user.validKeys = JSON.parse(user.validKeys)
  user.wrongKeys = JSON.parse(user.wrongKeys)

  const races = await Race.find(
    { user: user._id },
    '-_id createdAt score language corrections wrongWordsCount typedWordsCount achievements',
  )

  const orgs = await getOrgs(user.name)

  return { ...user, races, orgs, fetchedAt: Date.now() }
}

export const setRetryCtx = async (id, val) => {
  const user = await getUserById(id)
  user.retryCtx = val === 'inc' ? user.retryCtx + 1 : val

  await user.save()
}
