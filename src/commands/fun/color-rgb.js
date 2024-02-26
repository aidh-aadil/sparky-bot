const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const axios = require('axios')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('color-rgb')
    .setDescription('Get information about a rgb color')
    .addIntegerOption((option) =>
      option
        .setName('red')
        .setDescription('The red code of the color')
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(255)
    )
    .addIntegerOption((option) =>
      option
        .setName('green')
        .setDescription('The green code of the color')
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(255)
    )
    .addIntegerOption((option) =>
      option
        .setName('blue')
        .setDescription('The blue code of the color')
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(255)
    ),
  async execute(interaction) {
    try {
      await interaction.deferReply()

      const r = interaction.options.getInteger('red')
      const g = interaction.options.getInteger('green')
      const b = interaction.options.getInteger('blue')

      const response = await axios.get(
        `https://www.thecolorapi.com/id?rgb=(${r},${g},${b})`
      )
      const { name, hex, hsl } = response.data

      const url = await fetch(`https://api.popcat.xyz/color/${hex.clean}`)
      let info = await url.json()
      let image = info['color_image']

      const embed = new EmbedBuilder()
        .setColor(hex.clean)
        .setThumbnail(image)
        .addFields(
          { name: 'Name:', value: `${name.value || 'N/A'}`, inline: false },
          { name: 'Hex code', value: `${hex.value.toLowerCase()}` },
          {
            name: 'RGB:',
            value: `rgb (${r || 'N/A'}, ${g || 'N/A'}, ${b || 'N/A'})`,
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
