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

      const headsImage =
        'https://cdn.discordapp.com/attachments/1191439831633498176/1201937758021750794/heads.png?ex=65cba2c4&is=65b92dc4&hm=c3ea047c707807174a8054079d28bf10c71d5faf3b6de88450aa18cd5d341608&'
      const tailsImage =
        'https://cdn.discordapp.com/attachments/1191439831633498176/1201937757782413312/tails.png?ex=65cba2c4&is=65b92dc4&hm=24755d0e7e113f62ada7942d65e9a345f3f8685688595d0cfde37d19d0495e7a&'
      const tossGIF =
        'https://cdn.discordapp.com/attachments/1191439831633498176/1202098869136277514/coin_flipping.gif?ex=65cc38d0&is=65b9c3d0&hm=b2b63de1576f318beec1cfdd911a61d9953c2da53fd465a0ef6918ded8809c07&'

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
