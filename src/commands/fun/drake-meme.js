const { EmbedBuilder, SlashCommandBuilder } = require('@discordjs/builders')
const { colors } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('drake-meme')
    .setDMPermission(false)
    .setDescription('Generate your own drake meme')
    .addStringOption((option) =>
      option
        .setName('text-1')
        .setDescription('The text that drake dislikes')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('text-2')
        .setDescription('The text that drake likes')
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      await interaction.deferReply()

      const response = `https://api.popcat.xyz/drake?text1=${encodeURIComponent(
        interaction.options.get('text-1').value
      )}&text2=${encodeURIComponent(interaction.options.get('text-2').value)}`

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
      console.log(error)
    }
  },
}
