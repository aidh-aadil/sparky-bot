const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require('discord.js')

module.exports = {
  data: {
    name: 'warn',
    description: 'Warn an user',

    options: [
      {
        name: 'user',
        description: 'Select a user to warn',
        type: ApplicationCommandOptionType.Mentionable,
        required: true,
      },
      {
        name: 'reason',
        description: 'Reason for the warning',
        type: ApplicationCommandOptionType.String,
        required: false,
      },
    ],

    permissionsRequired: [PermissionFlagsBits.ModerateMembers],
    botPermissions: [PermissionFlagsBits.ModerateMembers],
  },

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
        await interaction.editReply(`You cannot warn yourself. LMAO!`)
        return
      }

      if (targetUser.id === interaction.guild.ownerId) {
        await interaction.editReply(
          `You are not allowed to warn that user. They are the server owner`
        )
        return
      }

      const targetUserRolePosition = targetUser.roles.highest.position
      const requestUserRolePosition = interaction.member.roles.highest.position
      const botRolePosition =
        interaction.guild.members.me.roles.highest.position

      if (targetUserRolePosition >= requestUserRolePosition) {
        await interaction.editReply(
          'You cannot warn someone higher than or equal to you.'
        )
        return
      }

      if (targetUserRolePosition >= botRolePosition) {
        await interaction.editReply(
          'I cannot warn someone higher than or equal to me.'
        )
        return
      }

      const embed = new EmbedBuilder()
        .setColor(0x9b59b6)
        .setDescription(
          `\nReason: ${reason}\nServer: ${interaction.guild.name}\nModerator: <@${interaction.member.id}>`
        )
        .setTimestamp()

      await interaction.editReply({
        content: `**${targetUser}, you have been warned!**`,
        embeds: [embed],
      })
    } catch (error) {
      console.log(error)
    }
  },
}
