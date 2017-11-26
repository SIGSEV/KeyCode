import { Map } from 'immutable'
import cache from 'memory-cache'

import User from 'api/models/user'
import Text from 'api/models/text'
import Race from 'api/models/race'

import { languages, lowerArr } from 'helpers/text'
import { getStats } from 'helpers/race'
import { getText } from 'api/services/text'
import {
  getTeamMembers,
  addUserToOrg,
  removeUserFromOrg,
  updateUserRank,
} from 'api/services/github'

const getLeaderboard = language =>
  Race.aggregate(
    [
      language && { $match: { language } },
      { $sort: { score: -1 } },
      {
        $group: {
          _id: '$user',
          user: { $first: '$user' },
          score: { $first: '$score' },
          language: { $first: '$language' },
          text: { $first: '$text' },
        },
      },
      { $sort: { score: -1 } },
      { $limit: 3 },
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

export const getLeaderboards = async () => {
  const cached = cache.get('leaderboards')
  if (cached) {
    return cached
  }

  const res = (await Promise.all(lowerArr.concat([null]).map(getLeaderboard))).reduce(
    (acc, cur, i) => ((acc[lowerArr[i] || 'global'] = cur), acc),
    {},
  )

  cache.put('leaderboards', res, 60e3 * 10)
  return res
}

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

  const newValid = user.validKeys
  const newWrong = user.wrongKeys

  Object.keys(validKeys).forEach(k => (newValid[k] = (newValid[k] || 0) + validKeys[k]))
  Object.keys(wrongKeys).forEach(k => (newWrong[k] = (newWrong[k] || 0) + wrongKeys[k]))

  user.validKeys = newValid
  user.wrongKeys = newWrong

  const text = await Text.findOne({ id: textId })

  if (text.difficulty === 0) {
    throw new Error('This text is not verified, cannot score on it yet.')
  }

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
    return getText(text.id)
  }

  await updateUserRank(user, score)

  return getText(text.id)
}
