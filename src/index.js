require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js')
const eventHandler = require('./handlers/eventHandler')
const mongoose = require('mongoose')

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.DirectMessages,
  ],
})

async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI)
    console.log('✅ Connected to database')
    
    eventHandler(client)
    client.login(process.env.BOT_TOKEN)

  } catch (error) {
    console.log(error)
  }
}

connect()
