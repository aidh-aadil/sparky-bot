const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { colors } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('encode-binary')
    .setDMPermission(false)
    .setDescription('Encode your input into binary digits')
    .addStringOption((option) =>
      option
        .setName('text')
        .setDescription('The text you want to encode')
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      await interaction.deferReply()

      const text = interaction.options.getString('text')

      let data = await fetch(`https://api.popcat.xyz/encode?text=${text}`)

      let info = await data.json()
      let result = info['binary']

      const embed = new EmbedBuilder()
        .setColor(colors.purple)
        .setTitle(`Binary encoding!`)
        .addFields([
          { name: 'Your input', value: `\`\`\`${text}\`\`\`` },
          { name: 'Binary', value: `\`\`\`${result}\`\`\`` },
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
