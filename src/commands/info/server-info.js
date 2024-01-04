const { EmbedBuilder, SlashCommandBuilder } = require('@discordjs/builders')
const { colors } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server-info')
    .setDescription('View some information about this server'),

  async execute(interaction) {
    try {
      if (interaction.guild) {
        await interaction.deferReply()

        const guildOwner = interaction.guild.fetchOwner()

        const description = `\`\`\`fix\nOwner:         ${
          (await guildOwner).user.username
        }\nServer ID:     ${
          interaction.guildId
        }\nCreation date: ${interaction.guild.createdAt.toUTCString()}\`\`\``

        function getVerificationLevel(lvl) {
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
              name: 'Channels and categories',
              value: `${interaction.guild.channels.cache.size}`,
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
      } else {
        await interaction.reply({
          content: 'You can only use this command in a server',
          ephemeral: true,
        })
      }
    } catch (error) {
      console.log(error)
    }
  },
}
