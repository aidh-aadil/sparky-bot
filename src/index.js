require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js')
const eventHandler = require('./handlers/eventHandler')

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
    client.login(process.env.BOT_TOKEN
      )

    eventHandler(client)

  } catch (error) {
    console.log(error)
  }
}

connect()
