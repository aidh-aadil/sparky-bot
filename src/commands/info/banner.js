const { EmbedBuilder, SlashCommandBuilder } = require('@discordjs/builders')
const { colors } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('banner')
    .setDMPermission(false)
    .setDescription('Fetch user banner')
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
        interaction.options.get('user')?.value || interaction.member.id
      const targetUser = await interaction.guild.members.fetch(targetUserID)

      // Checking the extension of the avatarURL to see if it is a gif
      function getExtension() {
        if (targetUser.user.bannerURL()) {
          // Split the URL by '/' to get the filename
          const parts = targetUser.user.bannerURL().split('/')
          // Get the last part which should be the filename
          const filename = parts[parts.length - 1]
          // Split the filename by '.' to get the extension
          const extensionParts = filename.split('.')
          // Get the last part which should be the extension
          const extension = extensionParts[extensionParts.length - 1]

          return extension
        }
      }

      function getDescription() {
        if (!targetUser.user.bannerURL()) {
          return `\`This user doesn't have a banner\``
        }
        if (getExtension() === 'gif') {
          return `[GIF](${targetUser.user.bannerURL({ size: 4096 })})`
        } else {
          return `[WEBP](${targetUser.user.bannerURL({
            size: 4096,
          })}) | [JPG](${targetUser.user.bannerURL({
            size: 4096,
            extension: 'jpg',
          })}) | [PNG](${targetUser.user.bannerURL({
            size: 4096,
            extension: 'png',
          })})`
        }
      }

      const embed = new EmbedBuilder()
        .setColor(colors.purple)
        .setTitle(`${targetUser.user.username}'s banner`)
        .setDescription(getDescription())
        .setImage(targetUser.user.bannerURL({ size: 4096 }))

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
