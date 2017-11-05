import mongoose, { Schema } from 'mongoose'

export default mongoose.model(
  'Text',
  new Schema({
    id: { type: String, unique: true },
    title: String,
    language: String,
    raw: String,

    stars: { type: Number, default: 0 },
    rates: Schema.Types.Mixed,

    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  }),
)
