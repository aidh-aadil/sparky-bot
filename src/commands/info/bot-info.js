const { EmbedBuilder, SlashCommandBuilder } = require('@discordjs/builders')
const { botVersion, status, colors } = require('../../../config.json')
const { version } = require('discord.js')
const { execSync } = require('child_process')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bot-info')
    .setDMPermission(false)
    .setDescription('View some information about the bot'),

  async execute(interaction) {
    try {
      const sent = await interaction.deferReply({ fetchReply: true })
      const uptime = formatUptime(interaction.client.uptime)
      const totalMembers = interaction.client.guilds.cache.reduce(
        (a, b) => a + b.memberCount,
        0
      )

      const commands = await interaction.client.application.commands.fetch()
      const totalCommands = commands.size

      const description = `\`\`\`fix\nDeveloper:   aidhaadil\nStatus:      ${status}\nLanguage:    JavaScript\nCreated on:  ${interaction.client.user.createdAt.toUTCString()}\nLast update: ${getLastCommitDate()}\`\`\``

      const pingField = `\`\`\`fix\nPing:   ${
        sent.createdTimestamp - interaction.createdTimestamp
      } ms\nWS:     ${
        interaction.client.ws.ping
      } ms\nUptime: ${uptime}\nNode:   ${
        process.version
      }\nDJS:    v${version}\`\`\``
      const statsField = `\`\`\`fix\nBot ID: ${interaction.client.user.id}\nBot Version: v${botVersion}\nServers: ${interaction.client.guilds.cache.size}\nUsers: ${totalMembers}\nCommands: ${totalCommands}\`\`\``

      const embed = new EmbedBuilder()
        .setTitle('Bot Info')
        .setColor(colors.purple)
        .setDescription(description)
        .addFields(
          { name: 'Ping', value: pingField, inline: true },
          { name: 'Stats', value: statsField, inline: true }
        )

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

function getLastCommitDate() {
  const command = `git log -1 --format="%cd" --date=format:"%d.%m.%Y" --all`
  const lastCommitDate = execSync(command, { encoding: 'utf-8' })
  return lastCommitDate.trim()
}
