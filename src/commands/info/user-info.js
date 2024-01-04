const { EmbedBuilder, SlashCommandBuilder } = require('@discordjs/builders')
const { colors } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('user-info')
    .setDescription('Fetch some information about the user')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('Select the user')
        .setRequired(false)
    ),

  async execute(interaction) {
    try {
      if (!interaction.inGuild()) {
        await interaction.reply({
          content: 'Use this command in a server',
          ephemeral: true,
        })
        return
      }

      await interaction.deferReply()

      const targetUserID =
        interaction.options.get('user')?.value || interaction.member.id
      const targetUser = await interaction.guild.members.fetch(targetUserID)

      const embed = new EmbedBuilder()
        .setTitle(`${targetUser.user.username}`)
        .setColor(colors.purple)
        .setThumbnail(targetUser.user.avatarURL())
        .addFields(
          { name: 'Username', value: `${targetUser.user.tag}`, inline: true },
          { name: 'User ID', value: `${targetUserID}`, inline: true },
          { name: 'Joined on', value: `${targetUser.joinedAt.toUTCString()}` },
          {
            name: 'Created on',
            value: `${targetUser.user.createdAt.toUTCString()}`,
            inline: true,
          }
        )

      await interaction.editReply({
        embeds: [embed],
      })
    } catch (error) {
      console.log(error)
    }
  },
}
