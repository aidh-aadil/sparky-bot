const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const axios = require('axios')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('random-color')
    .setDMPermission(false)
    .setDescription('Get a random color'),

  async execute(interaction) {
    try {
      await interaction.deferReply()

      const url = await fetch(`https://api.popcat.xyz/randomcolor`)

      let info = await url.json()
      let name = info['name']
      let hex = info['hex']
      let image = info['image']

      const response = await axios.get(
        `https://www.thecolorapi.com/id?hex=${hex}`
      )
      const { rgb, hsl } = response.data

      const embed = new EmbedBuilder()
        .setColor(hex)
        .setThumbnail(image)
        .addFields([
          { name: 'Name', value: name },
          { name: 'Hex code', value: `#${hex.toLowerCase()}` },
          {
            name: 'RGB:',
            value: `rgb (${rgb.r || 'N/A'}, ${rgb.g || 'N/A'}, ${
              rgb.b || 'N/A'
            })`,
          },
          {
            name: 'HSL:',
            value: `hsl (${hsl.h || 'N/A'}, ${hsl.s || 'N/A'}, ${
              hsl.l || 'N/A'
            })`,
          },
        ])

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
