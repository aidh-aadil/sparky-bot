const { ActivityType } = require("discord.js");
const { botVersion } = require('../../../config.json')

module.exports = (client) => {
    console.log(`✅ Logged in as ${client.user.tag}.`);
    
    client.user.setActivity({
      name: `🤖 v${botVersion}`,
      type: ActivityType.Custom
    })
}
  