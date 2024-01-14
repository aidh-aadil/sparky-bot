const { PermissionFlagsBits } = require('discord.js')
const { EmbedBuilder, SlashCommandBuilder } = require('@discordjs/builders')
const { colors } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDMPermission(false)
    .setDescription('Kick user from this server')
    .addUserOption((option) =>
      option.setName('user').setDescription('Select the user').setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('reason')
        .setDescription('Reason for kicking')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    try {
      const targetUserID = interaction.options.get('user')?.value
      const reason =
        interaction.options.get('reason')?.value || 'No reason provided.'

      const targetUser = await interaction.guild.members.fetch(targetUserID)

      await interaction.deferReply()

      if (!targetUser) {
        await interaction.editReply(`Looks like that user isn't in this server`)
        return
      }

      if (targetUser.id == interaction.member.id) {
        await interaction.editReply(`You cannot kick yourself. Bozo!`)
        return
      }

      if (targetUser.id === interaction.guild.ownerId) {
        await interaction.editReply(
          `You are not allowed to kick that user. They are the server owner`
        )
        return
      }

      const targetUserRolePosition = targetUser.roles.highest.position
      const requestUserRolePosition = interaction.member.roles.highest.position
      const botRolePosition =
        interaction.guild.members.me.roles.highest.position

      if (targetUserRolePosition >= requestUserRolePosition) {
        await interaction.editReply(
          'You cannot kick someone higher than or equal to you.'
        )
        return
      }

      if (targetUserRolePosition >= botRolePosition) {
        await interaction.editReply(
          'I cannot kick someone higher than or equal to me.'
        )
        return
      }

      await targetUser.kick({ reason })

      const embed = new EmbedBuilder().setColor(colors.red).setFooter({
        text: `Reason: ${reason}\nModerator: ${interaction.user.username}`,
      })

      await interaction.editReply({
        content: `**${targetUser} has been kicked!**`,
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
