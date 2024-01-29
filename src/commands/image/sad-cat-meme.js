const { EmbedBuilder, SlashCommandBuilder } = require('@discordjs/builders')
const { colors } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sad-cat-meme')
    .setDMPermission(false)
    .setDescription('Generate a sad cat meme')
    .addStringOption((option) =>
      option
        .setName('text')
        .setDescription('The text you want to display')
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      await interaction.deferReply()

      const response = `https://api.popcat.xyz/sadcat?text=${encodeURIComponent(
        interaction.options.get('text').value
      )}`

      const embed = new EmbedBuilder()
        .setColor(colors.invis)
        .setImage(response)
        .setFooter({
          text: 'Source: https://popcat.xyz/api',
        })
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
