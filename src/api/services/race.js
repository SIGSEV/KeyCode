import { Map } from 'immutable'

import Text from 'api/models/text'
import Race from 'api/models/race'

import { getStats } from 'helpers/race'
import { updateUserRank } from 'api/services/github'

export const saveRace = async (payload, user) => {
  const {
    textId,
    time,
    corrections,
    typedWordsCount,
    validKeys,
    wrongKeys,
    wrongWordsCount,
  } = payload

  const { wpm, score } = getStats(Map({ time, corrections, typedWordsCount, wrongWordsCount }))

  Object.keys(validKeys).forEach(k => (user.validKeys[k] += validKeys[k]))
  Object.keys(wrongKeys).forEach(k => (user.wrongKeys[k] += wrongKeys[k]))

  const text = await Text.findOne({ id: textId })

  await Race.create({
    textId: text._id,
    time,
    wpm,
    score,
    corrections,
    wrongWordsCount,
    typedWordsCount,
    validKeys,
    wrongKeys,
    language: text.language,
  })

  await user.save()

  if (score < user.currentOrg) {
    return
  }

  return updateUserRank(user, score)
}
