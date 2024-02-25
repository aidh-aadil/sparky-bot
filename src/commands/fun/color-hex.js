const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const axios = require('axios')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('color-hex')
    .setDescription('Get information about a hex color')
    .addStringOption((option) =>
      option
        .setName('code')
        .setDescription('The hex color code without #')
        .setRequired(true)
        .setMinLength(6)
        .setMaxLength(6)
    ),
  async execute(interaction) {
    try {
      await interaction.deferReply()

      const hexCode = interaction.options.getString('code')

      const response = await axios.get(
        `https://www.thecolorapi.com/id?hex=${hexCode}`
      )
      const { name, rgb, hsl } = response.data

      const url = await fetch(`https://api.popcat.xyz/color/${hexCode}`)
      let info = await url.json()
      let image = info['color_image']

      const embed = new EmbedBuilder()
        .setColor(hexCode)
        .setThumbnail(image)
        .addFields(
          { name: 'Name:', value: `${name.value || 'N/A'}`, inline: false },
          { name: 'Hex code', value: `#${hexCode.toLowerCase()}` },
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
          }
        )
        .setFooter({
          text: 'Source: https://www.thecolorapi.com',
        })

      await interaction.editReply({ embeds: [embed] })
    } catch (error) {
      await interaction
        .editReply('Unable to convert that color code.')
        .then((msg) => {
          setTimeout(() => {
            msg.delete()
          }, 10000)
        })
      console.log(error)
    }
  },
}
