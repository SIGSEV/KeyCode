import User from 'api/models/user'
import Race from 'api/models/race'

import { getOrgs } from 'api/services/github'

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

export const getUser = async name => {
  const user = (await getByName(name)).toObject()
  user.validKeys = JSON.parse(user.validKeys)
  user.wrongKeys = JSON.parse(user.wrongKeys)

  const races = await Race.find(
    { user: user._id },
    '-_id createdAt score language corrections wrongWordsCount typedWordsCount',
  )

  const orgs = await getOrgs(user.name)

  return { ...user, races, orgs, fetchedAt: Date.now() }
}
