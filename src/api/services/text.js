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

export const getRandomText = async () => {
  const count = await Text.count()
  const random = Math.floor(Math.random() * count)
  const text = await Text.findOne().skip(random)
  return { id: text._id.toString() }
}

export const getText = async id => {
  const text = await Text.findOne({ id })
  const leaders = await Race.find({ textId: text._id })
    .sort('-wpm')
    .limit(10)
    .exec()

  const out = text.toObject()
  out.leaders = leaders
  return out
}

export const voteText = async (id, user) => {
  const test = await getText(id)

  if (test.rates[user]) {
    test.stars--
    delete test.rates[user]
  } else {
    test.stars++
    test.rates[user] = true
  }

  return test.save()
}

export const getTexts = language =>
  Text.find(language ? { language } : {})
    .sort('-stars')
    .exec()
