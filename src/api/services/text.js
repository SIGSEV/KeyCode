import faker from 'faker'

import Text from 'api/models/text'
import Race from 'api/models/race'

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
    id: await uniqueId(),
  })

const populateLeaders = async text => {
  const leaders = await Race.find({ textId: text._id })
    .sort('-wpm')
    .limit(10)
    .exec()

  const out = text.toObject()
  out.leaders = leaders
  return out
}

export const getRandomText = async () => {
  const count = await Text.count()
  const random = Math.floor(Math.random() * count)
  const text = await Text.findOne().skip(random)
  return populateLeaders(text)
}

export const getText = async id => {
  const text = await Text.findOne({ id })
  return populateLeaders(text)
}

export const voteText = async (id, user) => {
  const text = await Text.findOne({ id })
  const stars = text.stars + (text.rates[user] ? -1 : 1)
  await text.update({ $set: { stars, [`rates.${user}`]: !text.rates[user] } })

  return getText(id)
}

export const getTexts = language =>
  Text.find(language ? { language } : {})
    .sort('-stars')
    .limit(language ? 100 : 10)
    .exec()
