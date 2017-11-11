import { Map } from 'immutable'

import Text from 'api/models/text'
import Race from 'api/models/race'

import { getStats } from 'helpers/race'
import { updateUserRank } from 'api/services/github'

export const getLeaderboard = language =>
  Race.aggregate(
    [
      language && { $match: { language } },
      { $sort: { score: -1 } },
      {
        $group: {
          _id: '$user',
          user: { $first: '$user' },
          wpm: { $first: '$wpm' },
          score: { $first: '$score' },
          language: { $first: '$language' },
          text: { $first: '$text' },
        },
      },
      { $limit: 10 },
      { $project: { _id: 0 } },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $lookup: {
          from: 'texts',
          localField: 'text',
          foreignField: '_id',
          as: 'text',
        },
      },
      { $unwind: { path: '$user' } },
      { $unwind: { path: '$text' } },
      {
        $project: {
          wpm: 1,
          score: 1,
          language: 1,
          'text.id': 1,
          'text.title': 1,
          'user.name': 1,
          'user.avatar': 1,
        },
      },
    ].filter(f => f),
  )

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

  if (!score) {
    throw new Error('Prevented saving noob score.')
  }

  Object.keys(validKeys).forEach(k => (user.validKeys[k] += validKeys[k]))
  Object.keys(wrongKeys).forEach(k => (user.wrongKeys[k] += wrongKeys[k]))

  const text = await Text.findOne({ id: textId })

  await Race.create({
    text: text._id,
    user: user._id,
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
