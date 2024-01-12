const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { colors } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('meme')
    .setDMPermission(false)
    .setDescription('Get a random meme'),

  async execute(interaction) {
    try {
      await interaction.deferReply()

      const url = await fetch(`https://api.popcat.xyz/meme`)

      let info = await url.json()
      let title = info['title']
      let image = info['image']

      const embed = new EmbedBuilder()
        .setColor(colors.purple)
        .setTitle(`${title}`)
        .setImage(image)

      await interaction.editReply({ embeds: [embed] })
    } catch (error) {
      console.log(error)
    }
  },
}
