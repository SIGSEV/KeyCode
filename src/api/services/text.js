import faker from 'faker'

import Text from 'api/models/text'

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
