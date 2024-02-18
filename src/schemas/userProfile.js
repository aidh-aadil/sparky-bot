const { Schema, model } = require('mongoose')

const userProfileSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    guildId: {
      type: String,
      required: true,
    },
    stars: {
      type: Number,
      default: 0,
    },
    lastStarGiven: {
      type: Date,
    },
    balance: {
      type: Number,
      default: 0,
    },
    lastDailyCollected: {
      type: Date,
    },
  },
  { timestamps: true }
)

module.exports = model('UserProfile', userProfileSchema)
