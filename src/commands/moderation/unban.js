const { PermissionFlagsBits } = require('discord.js')
const { EmbedBuilder, SlashCommandBuilder } = require('@discordjs/builders')
const { colors } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDMPermission(false)
    .setDescription('Unban a banned user')
    .addStringOption((option) =>
      option
        .setName('user-id')
        .setDescription('What is the id of the user you want to unban?')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const targetUserID = interaction.options.getString('user-id')

    await interaction.deferReply()

    const errEmbed = new EmbedBuilder().setColor(colors.red)

    try {
      await interaction.guild.bans.remove(targetUserID)

      const embed = new EmbedBuilder().setColor(colors.red).setFooter({
        text: `Moderator: ${interaction.user.username}`,
        iconURL: interaction.user.avatarURL(),
      })

      await interaction.editReply({
        content: `\`${targetUserID}\` **has been unbanned!**`,
        embeds: [embed],
      })
    } catch (error) {
      errEmbed
        .setTitle('Error!')
        .setDescription('Not a valid previously-banned member')
      await interaction.editReply({
        embeds: [errEmbed],
      })
    }
  },
}
