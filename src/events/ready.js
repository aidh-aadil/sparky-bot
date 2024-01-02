const { Events, ActivityType } = require('discord.js')
const { botVersion } = require('../../config.json');

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`✅ Logged in as ${client.user.tag}.`)

    client.user.setActivity({
      name: `🤖 v${botVersion}`,
      type: ActivityType.Custom,
    })
  },
}
