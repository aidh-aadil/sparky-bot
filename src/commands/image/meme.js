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
      let memeURL = info['url']

      const errEmbed = new EmbedBuilder().setColor(colors.red)

      if (info['error']) {
        errEmbed.setDescription(info['error'])
        return await interaction.editReply({ embeds: [errEmbed] })
      }

      const embed = new EmbedBuilder()
        .setColor(colors.invis)
        .setDescription(`[${title}](${memeURL})`)
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
