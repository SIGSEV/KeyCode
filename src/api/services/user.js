import pick from 'lodash/pick'

import User from 'api/models/user'
import Test from 'api/models/test'

import { updateUserOrg } from 'api/services/github'

export const getAll = () => User.findAll()
export const getById = id => User.findById(id)
export const getByGithub = githubId => User.findOne({ githubId })

export const updateOrCreate = async (githubId, name, avatar, token) => {
  const user = await getByGithub(githubId)

  if (!user) {
    return User.create({ githubId, name, avatar, token })
  }

  // fuck this i dont fuciing carreeee fuk uu
  if (name === user.name && avatar === user.avatar && token === user.token) {
    return user
  }

  user.set({ name, avatar, token })
  return user.save()
}

export const newResult = async test => {
  const user = await getById(test.userId)
  if (!user) {
    throw new Error('No such user.')
  }

  await Test.create(test)

  // if (test.wpm < user.currentOrg) {
  //   return
  // }

  // return updateUserOrg(user, test.wpm)
}
