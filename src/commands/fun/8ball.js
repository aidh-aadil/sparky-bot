const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { colors } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDMPermission(false)
    .setDescription('Ask magic 8ball a yes/no question')
    .addStringOption((option) =>
      option
        .setName('question')
        .setDescription('What do you want to ask?')
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      await interaction.deferReply()

      const question = interaction.options.getString('question')

      let answer = await fetch(`https://api.popcat.xyz/8ball`)

      let info = await answer.json()
      let result = info['answer']

      const embed = new EmbedBuilder()
        .setColor(colors.purple)
        .setThumbnail(
          'https://images-ext-2.discordapp.net/external/xdeZN98fGwa0eMeRNFqs-2d9jXi2nKE2LDsSeJlHopo/https/twemoji.maxcdn.com/v/latest/72x72/1f3b1.png?format=webp&quality=lossless'
        )
        .setTitle(`Magic 8ball`)
        .addFields(
          { name: 'Question', value: `${question}` },
          { name: 'Answer', value: `${result}` }
        )

      await interaction.editReply({ embeds: [embed] })
    } catch (error) {
      await interaction.editReply({
        content: 'Oops! There was an error.',
      })
      console.log(error)
    }
  },
}
