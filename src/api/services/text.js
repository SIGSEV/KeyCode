import faker from 'faker'

import Text from 'api/models/text'
import Race from 'api/models/race'

import { lowerMap } from 'helpers/text'

const uniqueId = async () => {
  const id = [...Array(3)]
    .map(() =>
      faker.random
        .word()
        .split(' ')[0]
        .toLowerCase(),
    )
    .join('-')
    .replace(/\//g, '')

  const exists = await Text.findOne({ id })
  if (exists) {
    return uniqueId()
  }

  return id
}

export const createText = async payload =>
  Text.create({
    ...payload,
    raw: payload.raw.trim(),
    id: await uniqueId(),
  })

const populateText = async text => {
  const leaders = await Race.find({ text: text._id }, 'wpm score user')
    .sort('-wpm')
    .populate('user', 'name avatar')
    .exec()

  await text.populate({ path: 'author', select: 'name avatar' }).execPopulate()

  const out = text.toObject()

  out.language = lowerMap[out.language]
  out.leaders = leaders.reduce(
    (acc, cur) =>
      acc.length === 10 || acc.some(a => a.user._id.equals(cur.user._id)) ? acc : acc.concat([cur]),
    [],
  )

  return out
}

export const getRandomText = async () => {
  const count = await Text.count()
  const random = Math.floor(Math.random() * count)
  const text = await Text.findOne().skip(random)

  return populateText(text)
}

export const getText = async id => {
  const text = await Text.findOne({ id })
  return populateText(text)
}

export const voteText = async (id, userId) => {
  const text = await Text.findOne({ id })
  const stars = text.stars + (text.rates[userId] ? -1 : 1)
  await text.update({ $set: { stars, [`rates.${userId}`]: !text.rates[userId] } })

  return getText(id)
}

export const deleteText = async (id, user) => {
  const text = await Text.findOne({ id })
  if (user.admin || user._id.equals(text.author)) {
    return text.remove()
  }

  throw new Error('Unauthorized.')
}

export const getTexts = async language => {
  const texts = await Text.find(language ? { language } : {})
    .sort('-stars')
    .limit(language ? 100 : 10)
    .exec()

  return Promise.all(texts.map(populateText))
}
