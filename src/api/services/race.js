import cache from 'memory-cache'

import User from 'api/models/user'
import Text from 'api/models/text'
import Race from 'api/models/race'

import { languages, lowerArr } from 'helpers/text'
import { getText } from 'api/services/text'
import { getUsersCount } from 'api/services/user'
import { raceTrigger } from 'api/services/achievements'
import {
  getTeamMembers,
  addUserToOrg,
  removeUserFromOrg,
  updateUserRank,
} from 'api/services/github'

const getLeaderboard = (language, limit = 10) =>
  Race.aggregate(
    [
      { $match: { hidden: false, ...(language ? { language } : {}) } },
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
      { $limit: limit },
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

  const res = (await Promise.all(lowerArr.concat([null]).map(l => getLeaderboard(l)))).reduce(
    (acc, cur, i) => ((acc[lowerArr[i] || 'global'] = cur), acc),
    {},
  )

  cache.put('leaderboards', res, 60e3 * 10)
  return res
}

export const refreshLeaderOrgs = async () => {
  const count = await getUsersCount()
  if (count < 100) {
    return
  }

  languages.forEach(async language => {
    try {
      const leaders = await getLeaderboard(language.toLowerCase(), 3)
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
    score,
    wpm,
    textId,
    time,
    log,
    corrections,
    typedWordsCount,
    validKeys,
    wrongKeys,
    wrongWordsCount,
  } = payload

  if (!score) {
    throw new Error('Prevented saving noob score.')
  }

  if (score > 200 && user.name !== 'tuukkao') {
    throw new Error('Yes sure, not possible yet g0d/h4xxor')
  }

  const newValid = user.validKeys
  const newWrong = user.wrongKeys

  Object.keys(validKeys).forEach(k => (newValid[k] = (newValid[k] || 0) + validKeys[k]))
  Object.keys(wrongKeys).forEach(k => (newWrong[k] = (newWrong[k] || 0) + wrongKeys[k]))

  user.validKeys = newValid
  user.wrongKeys = newWrong

  const text = await Text.findOne({ id: textId })
  await raceTrigger(payload, user, text)

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

  if (score > user.currentOrg) {
    await updateUserRank(user, score)
  }

  return getText(text.id)
}
