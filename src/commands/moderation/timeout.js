const { PermissionFlagsBits } = require('discord.js')
const { EmbedBuilder, SlashCommandBuilder } = require('@discordjs/builders')
const { colors } = require('../../../config.json')
const ms = require('ms')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDMPermission(false)
    .setDescription('Timeout a user')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user you want to timeout')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('duration')
        .setDescription('Duration of the timeout')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('reason')
        .setDescription('Reason for the timeout')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    try {
      await interaction.deferReply()

      const targetUserID = interaction.options.getUser('user')
      const targetUser = await interaction.guild.members.fetch(targetUserID)
      const duration = interaction.options.getString('duration')
      const reason =
        interaction.options.getString('reason') || 'No reason provided.'

      if (!targetUser) {
        await interaction.editReply(`Looks like that user isn't in this server`)
        return
      }

      if (targetUser.bot) {
        await interaction.editReply(`You cannot timeout a bot`)
        return
      }

      if (targetUser.id == interaction.member.id) {
        await interaction.editReply(`You cannot timeout yourself. Bozo!`)
        return
      }

      if (targetUser.id === interaction.guild.ownerId) {
        await interaction.editReply(
          `You are not allowed to timeout that user. They are the server owner`
        )
        return
      }

      const msDuration = ms(duration)
      if (isNaN(msDuration)) {
        await interaction
          .editReply('Please provide a valid time duration')
          .then((msg) => {
            setTimeout(() => {
              msg.delete()
            }, 10000)
          })
        return
      }

      if (msDuration < 5000 || msDuration > 2419200000) {
        await interaction
          .editReply('Timeout duration must be between 5 seconds and 28 days')
          .then((msg) => {
            setTimeout(() => {
              msg.delete()
            }, 10000)
          })
        return
      }

      const targetUserRolePosition = targetUser.roles.highest.position
      const requestUserRolePosition = interaction.member.roles.highest.position
      const botRolePosition =
        interaction.guild.members.me.roles.highest.position

      if (targetUserRolePosition >= requestUserRolePosition) {
        await interaction.editReply(
          'You cannot timeout someone higher than or equal to you.'
        )
        return
      }

      if (targetUserRolePosition >= botRolePosition) {
        await interaction.editReply(
          'I cannot timeout someone higher than or equal to me.'
        )
        return
      }

      const { default: prettyMs } = await import('pretty-ms')
      const embed = new EmbedBuilder().setColor(colors.red).setFooter({
        text: `Reason: ${reason}\nModerator: ${
          interaction.user.username
        }\nDuration: ${prettyMs(msDuration)}`,
      })

      if (targetUser.isCommunicationDisabled()) {
        await targetUser.timeout(msDuration, reason)
        await interaction.editReply({
          content: `**${targetUser}'s timeout has been updated!**`,
          embeds: [embed],
        })
        return
      }

      await targetUser.timeout(msDuration, reason)
      await interaction.editReply({
        content: `**${targetUser} has been timed out!**`,
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