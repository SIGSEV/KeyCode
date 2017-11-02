import mongoose, { Schema } from 'mongoose'

export default mongoose.model(
  'User',
  new Schema({
    githubId: { type: Number, unique: true },

    name: String,
    avatar: String,
    email: String,

    token: String,
    currentOrg: Number,

    validKeys: Schema.Types.Mixed,
    wrongKeys: Schema.Types.Mixed,

    banned: { type: Boolean, default: false },
  }),
)
