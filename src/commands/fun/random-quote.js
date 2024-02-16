const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { colors } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('random-quote')
    .setDMPermission(false)
    .setDescription('Get a random quote'),

  async execute(interaction) {
    try {
      await interaction.deferReply()

      const url = await fetch(`https://api.popcat.xyz/quote`)

      let info = await url.json()
      let quote = info['quote']

      const embed = new EmbedBuilder()
        .setColor(colors.invis)
        .setDescription(quote)

      await interaction.editReply({ embeds: [embed] })
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
