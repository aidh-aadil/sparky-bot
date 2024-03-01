const { EmbedBuilder, SlashCommandBuilder } = require('@discordjs/builders')
const { colors } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pickup-line')
    .setDMPermission(false)
    .setDescription('Get a random pickup line'),

  async execute(interaction) {
    try {
      await interaction.deferReply()

      const url = await fetch(`https://rizzapi.vercel.app/random`)

      let info = await url.json()

      let text = info['text']

      const embed = new EmbedBuilder()
        .setDescription(`${text}`)
        .setColor(colors.invis)

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
