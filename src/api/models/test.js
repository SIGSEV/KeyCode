import mongoose, { Schema } from 'mongoose'

export default mongoose.model(
  'Test',
  new Schema({
    id: Number,
    line: Number,
    cursor: Number,
    scroll: Number,
    wordIndex: Number,
    corrections: Number,
    typedWord: String,
    typedChar: String,
    typedWordsCount: Number,

    validKeys: Schema.Types.Mixed,
    wrongKeys: Schema.Types.Mixed,

    language: String,
  }),
)
