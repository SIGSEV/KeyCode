import { Map } from 'immutable'

import User from 'api/models/user'
import Text from 'api/models/text'
import Race from 'api/models/race'

import { languages } from 'helpers/text'
import { getStats } from 'helpers/race'
import {
  getTeamMembers,
  addUserToOrg,
  removeUserFromOrg,
  updateUserRank,
} from 'api/services/github'

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
          _id: 0,
          wpm: 1,
          score: 1,
          language: 1,
          'text.id': 1,
          'text.title': 1,
          'user.name': 1,
          'user.avatar': 1,
        },
      },
      { $sort: { score: -1 } },
    ].filter(f => f),
  )

export const refreshLeaderOrgs = () => {
  languages.forEach(async language => {
    try {
      const leaders = await getLeaderboard(language.toLowerCase())
      const leaderNames = leaders.map(l => l.user.name)
      const members = (await getTeamMembers(language)).filter(f => f.login !== 'KeyCode-Master')
      const memberNames = members.map(m => m.login)

      memberNames.forEach(async name => {
        if (!leaderNames.includes(name)) {
          await removeUserFromOrg(name, language)
        }
      })

      leaders.forEach(async leader => {
        if (memberNames.includes(leader.user.name)) {
          return
        }

        const user = await User.findOne({ name: leader.user.name })
        await addUserToOrg(user, language)
      })
    } catch (e) {
      console.log(e) // eslint-disable-line
    }
  })
}

export const saveRace = async (payload, user) => {
  const {
    textId,
    time,
    log,
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

  if (score > 200) {
    throw new Error('Yes sure, not possible yet g0d/h4xxor')
  }

  Object.keys(validKeys).forEach(k => (user.validKeys[k] += validKeys[k]))
  Object.keys(wrongKeys).forEach(k => (user.wrongKeys[k] += wrongKeys[k]))

  const text = await Text.findOne({ id: textId })

  await Race.create({
    text: text._id,
    user: user._id,
    time,
    log,
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
