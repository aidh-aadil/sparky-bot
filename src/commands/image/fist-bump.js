const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { colors } = require('../../../config.json')
const axios = require('axios')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fist-bump')
    .setDMPermission(false)
    .setDescription('Fist bump a user')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user you want to fist bump')
        .setRequired(false)
    ),
  async execute(interaction) {
    try {
      await interaction.deferReply()

      const targetUserID =
        (await interaction.options.get('user')?.value) || interaction.member.id
      const targetUser = await interaction.guild.members.fetch(targetUserID)

      const result = await axios.get(
        'https://api.otakugifs.xyz/gif?reaction=brofist&format=gif'
      )

      const embed = new EmbedBuilder()
        .setImage(result.data.url)
        .setColor(colors.invis)

      if (interaction.user.id === targetUserID) {
        return await interaction.editReply({
          content: `${targetUser} fist bumped himself.`,
          embeds: [embed],
        })
      }

      await interaction.editReply({
        content: `
          ${interaction.user} fist bumped ${targetUser}`,
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
