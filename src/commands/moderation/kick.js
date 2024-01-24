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

      const errEmbed = new EmbedBuilder().setColor(colors.red)

      if (!targetUser) {
        errEmbed.setDescription(`Looks like that user isn't in this server`)
        await interaction.editReply({ embeds: [errEmbed] })
        return
      }

      if (targetUser.id == interaction.member.id) {
        errEmbed.setDescription(`You cannot kick yourself. Bozo!`)
        await interaction.editReply({ embeds: [errEmbed] })
        return
      }

      if (targetUser.id === interaction.guild.ownerId) {
        errEmbed.setDescription(
          `You are not allowed to kick that user. They are the server owner`
        )
        await interaction.editReply({ embeds: [errEmbed] })
        return
      }

      const targetUserRolePosition = targetUser.roles.highest.position
      const requestUserRolePosition = interaction.member.roles.highest.position
      const botRolePosition =
        interaction.guild.members.me.roles.highest.position

      if (targetUserRolePosition >= requestUserRolePosition) {
        errEmbed.setDescription(
          'You cannot kick someone higher than or equal to you.'
        )
        await interaction.editReply({ embeds: [errEmbed] })
        return
      }

      if (targetUserRolePosition >= botRolePosition) {
        errEmbed.setDescription(
          'I cannot kick someone higher than or equal to me.'
        )
        await interaction.editReply({ embeds: [errEmbed] })
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
