const { EmbedBuilder, SlashCommandBuilder } = require('@discordjs/builders')
const { version } = require('discord.js')
const { colors } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('View bot latency'),

  async execute(interaction) {
    try {
      const sent = await interaction.deferReply({ fetchReply: true })
      const uptime = formatUptime(interaction.client.uptime)

      const description = `\`\`\`fix\nPing:   ${
        sent.createdTimestamp - interaction.createdTimestamp
      } ms\nWS:     ${
        interaction.client.ws.ping
      } ms\nUptime: ${uptime}\nNode:   ${
        process.version
      }\nDJS:    v${version}\`\`\``

      const embed = new EmbedBuilder()
        .setDescription(description)
        .setColor(colors.purple)

      await interaction.editReply({
        embeds: [embed],
      })
    } catch (error) {
      await interaction.editReply('Oops! There was an error.').then((msg) => {
        setTimeout(() => {
          msg.delete()
        }, 10000)
      })
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
