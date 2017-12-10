import mongoose, { Schema } from 'mongoose'

import ridiculusType from 'api/models/ridiculusType'

const streakable = {
  value: { type: Number, default: 0 },
  cur: { type: Number, default: 0 },
}

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

      retryCtx: { type: Number, default: 0 },
      achievements: {
        racer: streakable,
        perfect: streakable,
        god: streakable,
        galvanizer: {
          value: { type: Number, default: 0 },
          texts: [
            {
              type: Schema.Types.ObjectId,
              ref: 'Text',
            },
          ],
        },
      },

      stats: {
        races: { type: Number, default: 0 },
        maxScore: { type: Number, default: 0 },
        typedChars: { type: Number, default: 0 },
        wrongChars: { type: Number, default: 0 },
        typedWords: { type: Number, default: 0 },
        wrongWords: { type: Number, default: 0 },
        // retries: Might be cool to have this but heh
      },

      layout: { type: String, enum: ['programmerDvorak', 'qwerty'], default: 'qwerty' },
      staggered: { type: Boolean, default: true },

      admin: { type: Boolean, default: false },
      verified: { type: Boolean, default: false },
      banned: { type: Boolean, default: false },
    },
    { minimize: false, timestamps: true },
  ),
)
