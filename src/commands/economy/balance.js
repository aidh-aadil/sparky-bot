const { EmbedBuilder, SlashCommandBuilder } = require('@discordjs/builders')
const UserProfile = require('../../schemas/userProfile')
const { colors, currencyEmotes } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('View user balance')
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('Select the user')
        .setRequired(false)
    ),

  async execute(interaction) {
    try {
      await interaction.deferReply()

      const targetUserID =
        interaction.options.get('user')?.value || interaction.user.id
      const targetUser = await interaction.guild.members.fetch(targetUserID)

      let userProfile = await UserProfile.findOne({
        userId: targetUserID,
        guildId: interaction.guild.id,
      })

      if (!userProfile) {
        userProfile = new UserProfile({
          userId: targetUserID,
          guildId: interaction.guild.id,
        })
      }

      const embed = new EmbedBuilder()
        .setColor(colors.purple)
        .setTitle(`${targetUser.user.username}'s balance`)
        .setDescription(
          `Balance: ${currencyEmotes.money} ${userProfile.balance}`
        )

      await interaction.editReply({
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
