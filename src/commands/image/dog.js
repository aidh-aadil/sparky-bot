const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { colors } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dog')
    .setDMPermission(false)
    .setDescription('Get a random dog image'),

  async execute(interaction) {
    try {
      await interaction.deferReply()

      const url = await fetch(`https://dog.ceo/api/breeds/image/random`)

      let info = await url.json()
      let image = info['message']

      const embed = new EmbedBuilder().setColor(colors.invis).setImage(image)

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
