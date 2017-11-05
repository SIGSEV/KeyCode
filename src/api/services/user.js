// import pick from 'lodash/pick'

import User from 'api/models/user'
import Race from 'api/models/race'

// import { updateUserOrg } from 'api/services/github'

export const getAllUsers = () => User.findAll()
export const getUserById = id => User.findById(id)
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
  const user = await getUserById(test.userId)
  if (!user) {
    throw new Error('No such user.')
  }

  await Race.create(test)

  // if (test.wpm < user.currentOrg) {
  //   return
  // }

  // return updateUserOrg(user, test.wpm)
}
