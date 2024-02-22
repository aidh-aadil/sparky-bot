const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

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

      const embed = new EmbedBuilder()
        .setColor(hex)
        .setThumbnail(image)
        .addFields([
          { name: 'Name', value: name },
          { name: 'Hex code', value: `#${hex.toLowerCase()}` },
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
