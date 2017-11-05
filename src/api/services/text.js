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

  const exists = await Text.findOne({ id })
  if (exists) {
    return uniqueId()
  }

  return id
}

export const createText = payload =>
  Text.create({
    ...payload,
    id: uniqueId(),
  })

export const getText = async id => {
  const text = await Text.findOne({ id })
  const leaders = await Race.find({ textId: id })
    .sort('-wpm')
    .filter(10)
    .exec()

  const out = text.toObject()
  out.leaders = leaders.toObject()
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