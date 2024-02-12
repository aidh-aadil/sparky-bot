const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { colors } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('decode-binary')
    .setDMPermission(false)
    .setDescription('Decode binary digits into text')
    .addStringOption((option) =>
      option
        .setName('binary')
        .setDescription('The binary digits you want to decode')
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      await interaction.deferReply()

      const binary = interaction.options.getString('binary')

      let data = await fetch(`https://api.popcat.xyz/decode?binary=${binary}`)

      let info = await data.json()
      let result = info['text']

      const embed = new EmbedBuilder()
        .setColor(colors.purple)
        .setTitle(`Binary decoding!`)
        .addFields([
          {
            name: 'Your input (binary digits)',
            value: `\`\`\`${binary}\`\`\``,
          },
          { name: 'Text', value: `\`\`\`${result}\`\`\`` },
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
