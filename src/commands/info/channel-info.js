const { EmbedBuilder, SlashCommandBuilder, ChannelType } = require('discord.js')
const { colors } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('channel-info')
    .setDMPermission(false)
    .setDescription('View some information about a channel')
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('The channel you want to view')
        .addChannelTypes(
          ChannelType.GuildText,
          ChannelType.GuildVoice,
          ChannelType.GuildAnnouncement,
          ChannelType.GuildForum,
          ChannelType.GuildStageVoice,
          ChannelType.GuildCategory
        )
        .setRequired(false)
    ),

  async execute(interaction) {
    try {
      await interaction.deferReply()

      let channel =
        interaction.options.getChannel('channel') || interaction.channel

      const embed = new EmbedBuilder().setColor(colors.purple)

      function formatSeconds(seconds) {
        let hours = Math.floor(seconds / 3600)
        let minutes = Math.floor((seconds % 3600) / 60)
        let remainingSeconds = seconds % 60

        let result = ''

        if (hours > 0) {
          result += `${hours} hours`
        }

        if (minutes > 0) {
          result += `${result.length > 0 ? ', ' : ''}${minutes} minutes`
        }

        if (remainingSeconds > 0 || result.length === 0) {
          result += `${
            result.length > 0 ? ', and ' : ''
          }${remainingSeconds} seconds`
        }

        return result
      }

      function getChannelType(channel) {
        if (channel === 0) return 'Text'
        if (channel === 5) return 'Announcement'
        if (channel === 15) return 'Forum'
        if (channel === 13) return 'Stage'
        if (channel === 2) return 'Voice'
        if (channel === 4) return 'Category'
      }

      if (channel.type === 4) {
        embed
          .setTitle(`${channel.name}`)
          .setThumbnail(interaction.guild.iconURL())
          .addFields([
            { name: 'ID', value: channel.id },
            {
              name: 'Created on',
              value: channel.createdAt.toUTCString(),
            },
            {
              name: 'Type',
              value: getChannelType(channel.type),
              inline: true,
            },
            {
              name: 'NSFW',
              value: channel.nsfw ? 'Yes' : 'No',
              inline: true,
            },
            {
              name: 'Viewable',
              value: channel.viewable ? 'Yes' : 'No',
              inline: true,
            },
            {
              name: 'Manageable',
              value: channel.manageable ? 'Yes' : 'No',
              inline: true,
            },
            {
              name: 'Slowmode',
              value: channel.rateLimitPerUser
                ? `${formatSeconds(channel.rateLimitPerUser)}`
                : 'None',
              inline: true,
            },
            {
              name: 'Total channels',
              value: channel.children.cache.size.toString(),
              inline: true,
            },
          ])

        await interaction.editReply({
          embeds: [embed],
        })
        return
      }

      if (channel.type === 15) {
        embed
          .setDescription(`${channel}`)
          .setThumbnail(interaction.guild.iconURL())
          .addFields([
            { name: 'ID', value: channel.id },
            {
              name: 'Created on',
              value: channel.createdAt.toUTCString(),
            },
            {
              name: 'Topic',
              value: channel.topic || 'No topic',
            },
            {
              name: 'Available Tags',
              value:
                channel.availableTags && channel.availableTags.length > 0
                  ? channel.availableTags.map((tag) => tag.name).join(', ')
                  : 'None',
            },
          ])

        if (channel.parent?.name) {
          embed.addFields([
            {
              name: 'Category',
              value: channel.parent.name,
              inline: true,
            },
          ])
        }

        embed.addFields([
          {
            name: 'Type',
            value: getChannelType(channel.type),
            inline: true,
          },
          {
            name: 'NSFW',
            value: channel.nsfw ? 'Yes' : 'No',
            inline: true,
          },
          {
            name: 'Viewable',
            value: channel.viewable ? 'Yes' : 'No',
            inline: true,
          },
          {
            name: 'Manageable',
            value: channel.manageable ? 'Yes' : 'No',
            inline: true,
          },
          {
            name: 'Slowmode',
            value: channel.rateLimitPerUser
              ? `${formatSeconds(channel.rateLimitPerUser)}`
              : 'None',
            inline: true,
          },
          {
            name: 'Total threads',
            value: channel.threads.cache.size.toString(),
            inline: true,
          },
        ])

        await interaction.editReply({
          embeds: [embed],
        })
        return
      }

      if (channel.type === 0 || channel.type == 5) {
        embed
          .setDescription(`${channel}`)
          .setThumbnail(interaction.guild.iconURL())
          .addFields([
            { name: 'ID', value: channel.id },
            {
              name: 'Created on',
              value: channel.createdAt.toUTCString(),
            },
            {
              name: 'Topic',
              value: channel.topic || 'No topic',
            },
          ])

        if (channel.parent?.name) {
          embed.addFields([
            {
              name: 'Category',
              value: channel.parent.name,
              inline: true,
            },
          ])
        }

        embed.addFields([
          {
            name: 'Type',
            value: getChannelType(channel.type),
            inline: true,
          },
          {
            name: 'NSFW',
            value: channel.nsfw ? 'Yes' : 'No',
            inline: true,
          },
          {
            name: 'Viewable',
            value: channel.viewable ? 'Yes' : 'No',
            inline: true,
          },
          {
            name: 'Manageable',
            value: channel.manageable ? 'Yes' : 'No',
            inline: true,
          },
          {
            name: 'Slowmode',
            value: channel.rateLimitPerUser
              ? `${formatSeconds(channel.rateLimitPerUser)}`
              : 'None',
            inline: true,
          },
        ])

        await interaction.editReply({
          embeds: [embed],
        })
        return
      }

      if (channel.type === 2) {
        embed
          .setDescription(`${channel}`)
          .setThumbnail(interaction.guild.iconURL())
          .addFields([
            { name: 'ID', value: channel.id },
            {
              name: 'Created on',
              value: channel.createdAt.toUTCString(),
            },
          ])

        if (channel.parent?.name) {
          embed.addFields([
            {
              name: 'Category',
              value: channel.parent.name,
              inline: true,
            },
          ])
        }
        embed.addFields([
          {
            name: 'Type',
            value: getChannelType(channel.type),
            inline: true,
          },
          {
            name: 'Bitrate',
            value: `${channel.bitrate} bps`,
            inline: true,
          },
          {
            name: 'NSFW',
            value: channel.nsfw ? 'Yes' : 'No',
            inline: true,
          },
          {
            name: 'Viewable',
            value: channel.viewable ? 'Yes' : 'No',
            inline: true,
          },
          {
            name: 'Manageable',
            value: channel.manageable ? 'Yes' : 'No',
            inline: true,
          },
          {
            name: 'Joinable',
            value: channel.joinable ? 'Yes' : 'No',
            inline: true,
          },
          {
            name: 'Speakable',
            value: channel.speakable ? 'Yes' : 'No',
            inline: true,
          },
          {
            name: 'User Limit',
            value:
              channel.userLimit === 0
                ? 'Infinite'
                : channel.userLimit.toString(),
            inline: true,
          },
        ])

        await interaction.editReply({
          embeds: [embed],
        })
        return
      }

      if (channel.type === 13) {
        embed
          .setDescription(`${channel}`)
          .setThumbnail(interaction.guild.iconURL())
          .addFields([
            { name: 'ID', value: channel.id },
            {
              name: 'Created on',
              value: channel.createdAt.toUTCString(),
            },
          ])

        if (channel.parent?.name) {
          embed.addFields([
            {
              name: 'Category',
              value: channel.parent.name,
              inline: true,
            },
          ])
        }
        embed.addFields([
          {
            name: 'Type',
            value: getChannelType(channel.type),
            inline: true,
          },
          {
            name: 'Bitrate',
            value: `${channel.bitrate} bps`,
            inline: true,
          },
          {
            name: 'NSFW',
            value: channel.nsfw ? 'Yes' : 'No',
            inline: true,
          },
          {
            name: 'Viewable',
            value: channel.viewable ? 'Yes' : 'No',
            inline: true,
          },
          {
            name: 'Manageable',
            value: channel.manageable ? 'Yes' : 'No',
            inline: true,
          },
          {
            name: 'Joinable',
            value: channel.joinable ? 'Yes' : 'No',
            inline: true,
          },
          {
            name: 'Speakable',
            value: channel.speakable ? 'Yes' : 'No',
            inline: true,
          },
          {
            name: 'User Limit',
            value: channel.userLimit.toString(),
            inline: true,
          },
        ])

        await interaction.editReply({
          embeds: [embed],
        })
        return
      }
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
