import mongoose, { Schema } from 'mongoose'

import ridiculusType from 'api/models/ridiculusType'

export default mongoose.model(
  'Race',
  new Schema(
    {
      text: {
        type: Schema.Types.ObjectId,
        ref: 'Text',
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },

      time: Number,
      wpm: Number,
      score: Number,
      log: String,

      corrections: Number,
      wrongWordsCount: Number,
      typedWordsCount: Number,

      validKeys: ridiculusType,
      wrongKeys: ridiculusType,

      language: String,
    },
    { minimize: false, timestamps: true },
  ),
)
