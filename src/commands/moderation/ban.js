const { PermissionFlagsBits } = require('discord.js')
const { EmbedBuilder, SlashCommandBuilder } = require('@discordjs/builders')
const { colors } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDMPermission(false)
    .setDescription('Ban user from this server')
    .addUserOption((option) =>
      option.setName('user').setDescription('Select the user').setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('reason')
        .setDescription('Reason for banning')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

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
        errEmbed.setDescription(`You cannot ban yourself`)
        await interaction.editReply({ embeds: [errEmbed] })
        return
      }

      if (targetUser.id === interaction.guild.ownerId) {
        errEmbed.setDescription(
          `You are not allowed to ban that user. They are the server owner`
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
          'You cannot ban someone higher than or equal to you'
        )
        await interaction.editReply({ embeds: [errEmbed] })
        return
      }

      if (targetUserRolePosition >= botRolePosition) {
        errEmbed.setDescription(
          'I cannot ban someone higher than or equal to me'
        )
        await interaction.editReply({ embeds: [errEmbed] })
        return
      }

      await targetUser.ban({ reason })

      const embed = new EmbedBuilder().setColor(colors.red).setFooter({
        text: `Reason: ${reason}\nModerator: ${interaction.user.username}`,
      })

      const dmEmbed = new EmbedBuilder()
        .setColor(colors.red)
        .setTitle(`You have been banned!`)
        .setDescription(`Reason: ${reason}\nServer: ${interaction.guild.name}`)

      if (!targetUser.dmChannel) await targetUser.createDM()

      await targetUser.dmChannel.send({
        embeds: [dmEmbed],
      })

      await interaction.editReply({
        content: `**${targetUser} has been banned!**`,
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
