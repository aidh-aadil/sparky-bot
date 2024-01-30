const {
  PermissionFlagsBits,
  EmbedBuilder,
  SlashCommandBuilder,
} = require('discord.js')
const { colors } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('untimeout')
    .setDMPermission(false)
    .setDescription('Remove timeout from a user')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user you want to untimeout')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    try {
      await interaction.deferReply()

      const targetUserID = interaction.options.getUser('user')
      const targetUser = await interaction.guild.members.fetch(targetUserID)

      const errEmbed = new EmbedBuilder().setColor(colors.red)

      if (!targetUser) {
        errEmbed.setDescription(`Looks like that user isn't in this server`)
        return await interaction.editReply({
          embeds: [errEmbed],
        })
      }

      if (targetUser.id == interaction.member.id) {
        errEmbed.setDescription(`You cannot enable your own permissions`)
        return await interaction.editReply({
          embeds: [errEmbed],
        })
      }

      if (!targetUser.isCommunicationDisabled()) {
        errEmbed.setDescription(`${targetUser} is already able to communicate`)
        return await interaction.editReply({
          embeds: [errEmbed],
        })
      }

      const embed = new EmbedBuilder().setColor(colors.green).setFooter({
        text: `Moderator: ${interaction.user.username}`,
      })

      const dmEmbed = new EmbedBuilder()
        .setColor(colors.red)
        .setTitle(`Your timeout have been removed!`)
        .setDescription(`Server: ${interaction.guild.name}`)

      if (!targetUser.dmChannel) await targetUser.createDM()

      await targetUser.dmChannel.send({
        embeds: [dmEmbed],
      })

      await targetUser.disableCommunicationUntil(null).then(
        await interaction.editReply({
          content: `${targetUser}'s timeout has been removed`,
          embeds: [embed],
        })
      )
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
