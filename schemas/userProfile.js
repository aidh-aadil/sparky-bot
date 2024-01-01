const { Schema, model} = require('mongoose')

const userProfileSchema = new Schema({
    userID: {
        type: String,
        required: true
    },
    guildID: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    lastDailyCollected: {
        type: Date,
    }
})

module.exports = model('UserProfile', userProfileSchema)