const { EmbedBuilder, SlashCommandBuilder } = require('@discordjs/builders')
const { colors } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server-info')
    .setDMPermission(false)
    .setDescription('View some information about this server'),

  async execute(interaction) {
    try {
      await interaction.deferReply()

      const guildOwner = interaction.guild.fetchOwner()

      const description = `\`\`\`fix\nOwner:         ${
        (await guildOwner).user.username
      }\nServer ID:     ${
        interaction.guildId
      }\nCreation date: ${interaction.guild.createdAt.toUTCString()}\`\`\``

      function getVerificationLevel(lvl) {
        if (lvl == 0) {
          return 'None'
        }

        if (lvl === 1) {
          return 'Low'
        }

        if (lvl == 2) {
          return 'Medium'
        }

        if (lvl == 3) {
          return 'High'
        }

        if (lvl == 4) {
          return 'Highest'
        }
      }

      function getExplicitContentFilterLevel(lvl) {
        if (lvl === 0) {
          return 'Disabled'
        }
        if (lvl === 1) {
          return 'Only for members without roles'
        }
        if (lvl === 2) {
          return 'All members'
        }
      }

      const textChannelCount = interaction.guild.channels.cache
        .filter((c) => c.type === 0)
        .toJSON().length
      const voiceChannelCount = interaction.guild.channels.cache
        .filter((c) => c.type === 2)
        .toJSON().length
      const categoryCount = interaction.guild.channels.cache
        .filter((c) => c.type === 4)
        .toJSON().length
      const threadCount = interaction.guild.channels.cache
        .filter((c) => c.type === 5)
        .toJSON().length

      const embed = new EmbedBuilder()
        .setTitle(`${interaction.guild.name}`)
        .setColor(colors.purple)
        .setDescription(description)
        .addFields(
          {
            name: 'Members',
            value: `${interaction.guild.memberCount}`,
            inline: true,
          },
          {
            name: 'Roles',
            value: `${interaction.guild.roles.cache.size}`,
            inline: true,
          },
          {
            name: 'Text channels',
            value: `${textChannelCount}`,
            inline: true,
          },
          {
            name: 'Voice channels',
            value: `${voiceChannelCount}`,
            inline: true,
          },
          {
            name: 'Categories',
            value: `${categoryCount}`,
            inline: true,
          },
          {
            name: 'Threads',
            value: `${threadCount}`,
            inline: true,
          },
          {
            name: 'Boosts',
            value: `${interaction.guild.premiumSubscriptionCount}`,
            inline: true,
          },
          {
            name: 'Image scan',
            value: `${getExplicitContentFilterLevel(
              interaction.guild.explicitContentFilter
            )}`,
            inline: true,
          },
          {
            name: 'Verification lvl',
            value: `${getVerificationLevel(
              interaction.guild.verificationLevel
            )}`,
            inline: true,
          }
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
