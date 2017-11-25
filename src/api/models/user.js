import mongoose, { Schema } from 'mongoose'

import ridiculusType from 'api/models/ridiculusType'

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
      validKeys: ridiculusType,
      wrongKeys: ridiculusType,

      admin: { type: Boolean, default: false },
      verified: { type: Boolean, default: false },
      banned: { type: Boolean, default: false },
    },
    { minimize: false, timestamps: true },
  ),
)
