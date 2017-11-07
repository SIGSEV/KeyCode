import mongoose, { Schema } from 'mongoose'

export default mongoose.model(
  'User',
  new Schema(
    {
      githubId: { type: Number, unique: true },

      name: String,
      avatar: String,
      email: String,

      token: String,
      currentOrg: Number,

      validKeys: { type: Schema.Types.Mixed, default: {} },
      wrongKeys: { type: Schema.Types.Mixed, default: {} },

      admin: { type: Boolean, default: false },
      banned: { type: Boolean, default: false },
    },
    { minimize: false },
  ),
)
