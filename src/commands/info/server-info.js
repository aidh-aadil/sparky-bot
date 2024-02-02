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

      const guildOwner = await interaction.guild.fetchOwner()

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

      function getNSFWLevel(lvl) {
        if (lvl === 0) {
          return 'Default'
        }
        if (lvl === 1) {
          return 'Explicit'
        }
        if (lvl === 2) {
          return 'Safe'
        }
        if (lvl === 3) {
          return 'Age restricted'
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
        .setImage(interaction.guild.bannerURL())
        .setThumbnail(interaction.guild.iconURL())
        .addFields(
          {
            name: 'Owner',
            value: `${guildOwner.user.username}`,
            inline: true,
          },
          {
            name: ' Server ID',
            value: `${interaction.guildId}`,
            inline: true,
          },
          {
            name: ' Created on',
            value: `${interaction.guild.createdAt.toUTCString()}`,
          },
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
            name: 'Voice channels',
            value: `${voiceChannelCount}`,
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
            name: 'Verification level',
            value: `${getVerificationLevel(
              interaction.guild.verificationLevel
            )}`,
            inline: true,
          },
          {
            name: 'Verified',
            value: interaction.guild.verified ? 'Yes' : 'No',
            inline: true,
          },
          {
            name: 'NSFW level',
            value: `${getNSFWLevel(interaction.guild.nsfwLevel)}`,
            inline: true,
          },
          {
            name: 'Features',
            value:
              `${interaction.guild.features
                .map(
                  (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                )
                .join(', ')}` || 'None',
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
