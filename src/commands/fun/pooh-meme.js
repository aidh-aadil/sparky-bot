const { EmbedBuilder, SlashCommandBuilder } = require('@discordjs/builders')
const { colors } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pooh-meme')
    .setDescription('Generate your own pooh meme')
    .addStringOption((option) =>
      option
        .setName('text-1')
        .setDescription('The text representing normal pooh')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('text-2')
        .setDescription('The text representing pooh with a tuxedo')
        .setRequired(true)
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

      const response = `https://api.popcat.xyz/pooh?text1=${encodeURIComponent(
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
