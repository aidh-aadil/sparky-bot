const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { colors } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('car')
    .setDMPermission(false)
    .setDescription('Get a random car'),

  async execute(interaction) {
    try {
      await interaction.deferReply()

      const url = await fetch(`https://api.popcat.xyz/car`)

      let info = await url.json()
      let title = info['title']
      let image = info['image']

      const embed = new EmbedBuilder()
        .setColor(colors.purple)
        .setFooter({ text: `${title}` })
        .setImage(image)

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
