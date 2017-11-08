import User from 'api/models/user'

export const getAllUsers = () => User.findAll()
export const getUserById = id => User.findById(id)
export const getByGithub = githubId => User.findOne({ githubId })

export const updateOrCreate = async (githubId, name, avatar, token) => {
  const user = await getByGithub(githubId)

  if (!user) {
    return User.create({ githubId, name, avatar, token })
  }

  if (name === user.name && avatar === user.avatar && token === user.token) {
    return user
  }

  user.set({ name, avatar, token })
  return user.save()
}
