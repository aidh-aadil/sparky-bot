const { EmbedBuilder } = require('@discordjs/builders')
const { version } = require('discord.js')

module.exports = {
  data: {
    name: 'ping',
    description: 'View bot latency',
  },

  async execute(interaction) {
    try {
      const sent = await interaction.deferReply({ fetchReply: true })
      const uptime = formatUptime(interaction.client.uptime)

      const description = `\`\`\`fix\nPing:   ${
        sent.createdTimestamp - interaction.createdTimestamp
      }ms\nWS:     ${
        interaction.client.ws.ping
      } ms\nUptime: ${uptime}\nNode:   ${
        process.version
      }\nDJS:    v${version}\`\`\``

      const embed = new EmbedBuilder()
        .setDescription(description)
        .setColor(0x9b59b6)

      await interaction.editReply({
        embeds: [embed],
      })
    } catch (error) {
      console.log(error)
    }
  },
}

function formatUptime(uptimeMilliseconds) {
  const seconds = Math.floor(uptimeMilliseconds / 1000)
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor(((seconds % 86400) % 3600) / 60)
  const secondsLeft = ((seconds % 86400) % 3600) % 60

  return `${days}d ${hours}h ${minutes}m ${secondsLeft}s`
}
