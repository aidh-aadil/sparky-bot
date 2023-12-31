const { EmbedBuilder, SlashCommandBuilder } = require('@discordjs/builders')
const { colors } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('oogway-quote')
    .setDescription('Generate a quote by master oogway')
    .addStringOption((option) =>
      option
        .setName('text')
        .setDescription('The quote you want to display')
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

      const response = `https://api.popcat.xyz/oogway?text=${encodeURIComponent(
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
      console.log(error)
    }
  },
}
