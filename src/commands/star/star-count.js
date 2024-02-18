const { EmbedBuilder, SlashCommandBuilder } = require('@discordjs/builders')
const UserProfile = require('../../schemas/userProfile')
const { colors, emotes } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('star-count')
    .setDescription('View how many stars a user has got')
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

      const targetUser =
        interaction.options.getMember('user') || interaction.member
      const targetUserID = targetUser.id

      if (!targetUser) {
        return await interaction.editRely('That user is not in this server')
      }

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
        .setColor(colors.blue)
        .setDescription(`${targetUser} has ${userProfile.stars} ${emotes.star}`)

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
