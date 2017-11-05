import mongoose, { Schema } from 'mongoose'

export default mongoose.model(
  'Text',
  new Schema({
    id: { type: String, unique: true },
    language: String,
    raw: String,
    rates: Schema.Types.Mixed,
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  }),
)
