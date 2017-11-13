import User from 'api/models/user'

export const getAllUsers = () => User.findAll()
export const getUserById = id => User.findById(id)
export const getByGithub = githubId => User.findOne({ githubId })

export const updateOrCreate = async (githubId, name, avatar, verified, token) => {
  const user = await getByGithub(githubId)

  if (!user) {
    return User.create({ githubId, name, avatar, verified, token })
  }

  user.set({ name, avatar, verified, token })
  return user.save()
}
