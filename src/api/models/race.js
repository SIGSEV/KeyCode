import mongoose, { Schema } from 'mongoose'

export default mongoose.model(
  'Race',
  new Schema({
    textId: {
      type: Schema.Types.ObjectId,
      ref: 'Text',
    },

    time: Number,
    wpm: Number,
    score: Number,

    corrections: Number,
    wrongWords: Number,
    typedWordsCount: Number,

    validKeys: Schema.Types.Mixed,
    wrongKeys: Schema.Types.Mixed,

    language: String,
  }),
)
