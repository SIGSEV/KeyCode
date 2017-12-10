import Race from 'api/models/race'

const streakableTrigger = (user, name, cond) => {
  if (cond) {
    user.achievements[name].cur++
    if (user.achievements[name].cur > user.achievements[name].value) {
      user.achievements[name].value = user.achievements[name].cur
    }
  } else {
    user.achievements[name].cur = 0
  }
}

export const raceTrigger = async (payload, user, text) => {
  const { score, wrongKeys } = payload

  const raceCount = await Race.count({ text: text._id })
  const textUserCount = (await Race.find({ text: text._id }).distinct('user')).length

  streakableTrigger(user, 'racer', score > 80)
  streakableTrigger(user, 'perfect', score > 70 && Object.keys(wrongKeys).length === 0)
  streakableTrigger(
    user,
    'god',
    score > 70 && Object.keys(wrongKeys).length === 0 && user.retryCtx === 1,
  )

  user.retryCtx = 0

  if (
    textUserCount >= 10 &&
    raceCount >= 100 &&
    !user.achievements.galvanizer.texts.find(t => t.equals(text._id))
  ) {
    user.achievements.galvanizer.texts.push(text._id)
    user.achievements.galvanizer.value++
  }
}
