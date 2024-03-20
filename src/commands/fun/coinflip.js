const { SlashCommandBuilder, EmbedBuilder, embedLength } = require('discord.js')
const { colors } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('coinflip')
    .setDMPermission(false)
    .setDescription('Flip a coin'),

  async execute(interaction) {
    try {
      await interaction.deferReply()

      const headsImage = 'https://i.imgur.com/3XG6zci.png'
      const tailsImage = 'https://i.imgur.com/9KC5oKz.png'
      const tossGIF = 'https://i.imgur.com/2g3VTG5.gif'

      const tossingEmbed = new EmbedBuilder()
        .setColor(colors.yellow)
        .setTitle('Tossing the coin!')
        .setImage(tossGIF)

      await interaction.editReply({ embeds: [tossingEmbed] })

      function getRandomBoolean() {
        return Math.random() < 0.5
      }

      const isHeads = getRandomBoolean()
      result = isHeads ? 'Heads' : 'Tails'
      image = isHeads ? headsImage : tailsImage

      const embed = new EmbedBuilder()
        .setColor(colors.invis)
        .setTitle(`You received ${result}`)
        .setImage(image)

      setTimeout(async () => {
        await interaction.editReply({ embeds: [embed] })
      }, 5000)
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
