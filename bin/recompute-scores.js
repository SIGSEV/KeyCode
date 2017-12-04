/* eslint-disable no-console */

import mongoose from 'mongoose'

import User from 'api/models/user'
import Race from 'api/models/race'
import Text from 'api/models/text'

import getStatsFromLog from 'helpers/getStatsFromLog'
import getScore from 'helpers/getScore'

mongoose.Promise = Promise
mongoose.connect('mongodb://localhost:27017/keycode', { useMongoClient: true })

//
;(async () => {
  try {
    const users = await User.find({})

    for (const user of users) {
      await treatUser(user)
    }

    process.exit(0)
  } catch (err) {
    console.log(`>> err:`, err)
    process.exit(1)
  }

  console.log(`NTHNTHN`)
})()

async function treatUser(user) {
  const races = await Race.find({ user: user._id })
  for (const race of races) {
    try {
      const text = await Text.findOne({ _id: race.text })

      const stats = getStatsFromLog(text.raw, race.log)
      const score = getScore({
        ...stats,
        time: race.time,
      })

      if (race.score !== score.score) {
        console.log(`>> updated race of ${user.name} from ${race.score} to ${score.score}`)
        race.score = score.score
        await race.save()
      }
    } catch (err) {
      console.log(`x  err trying to update race ${race._id}`)
    }
  }
}
