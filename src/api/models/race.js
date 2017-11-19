import mongoose, { Schema } from 'mongoose'

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

      corrections: Number,
      wrongWordsCount: Number,
      typedWordsCount: Number,

      validKeys: { type: Schema.Types.Mixed, default: {} },
      wrongKeys: { type: Schema.Types.Mixed, default: {} },

      language: String,
    },
    { minimize: false, timestamps: true },
  ),
)
