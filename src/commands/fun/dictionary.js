const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { colors } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dictionary')
    .setDMPermission(false)
    .setDescription('Search a word in the dictionary')
    .addStringOption((option) =>
      option
        .setName('word')
        .setDescription('The word you want to search')
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      await interaction.deferReply()

      const word = interaction.options.getString('word')

      let data = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      )

      if (data.statusText == 'Not Found') {
        return interaction.editReply(`The word **"${word}"** does not exist.`)
      }

      let info = await data.json()
      let result = info[0]

      let embedInfo = await result.meanings.map((data, index) => {
        let definition = data.definitions[0].definition || 'No definition found'
        let example = data.definitions[0].example || 'No example found'

        return {
          name:
            data.partOfSpeech.charAt(0).toUpperCase() +
            data.partOfSpeech.slice(1),
          value: `\`\`\` Description: ${definition} \n Example: ${example} \`\`\``,
        }
      })

      const embed = new EmbedBuilder()
        .setColor(colors.purple)
        .setTitle(`Definition of **${result.word}**`)
        .addFields(embedInfo)

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
