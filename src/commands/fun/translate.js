const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const translate = require('@iamtraction/google-translate')
const { colors } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('translate')
    .setDescription('Translate your text to another language')
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName('message')
        .setDescription('What do you want to translate?')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('language')
        .setDescription('What language do you want to translate to?')
        .addChoices(
          { name: 'English', value: 'en' },
          { name: 'Latin', value: 'la' },
          { name: 'French', value: 'fr' },
          { name: 'German', value: 'de' },
          { name: 'Italian', value: 'it' },
          { name: 'Portuguese', value: 'pt' },
          { name: 'Spanish', value: 'es' },
          { name: 'Greek', value: 'el' },
          { name: 'Russian', value: 'ru' },
          { name: 'Japanese', value: 'ja' },
          { name: 'Arabic', value: 'ar' }
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      await interaction.deferReply()

      const text = interaction.options.getString(`message`)
      const lan = interaction.options.getString(`language`)

      if (text.length > 1024) {
        await interaction
          .editReply('Your text exceeded the maximum character limit.')
          .then((msg) => {
            setTimeout(() => {
              msg.delete()
            }, 10000)
          })
        return
      }

      const translated = await translate(text, { to: `${lan}` })

      function getLanguage(language) {
        if (lan === 'en') return 'English'
        if (lan === 'la') return 'Latin'
        if (lan === 'fr') return 'French'
        if (lan === 'de') return 'German'
        if (lan === 'it') return 'Italian'
        if (lan === 'pt') return 'Portuguese'
        if (lan === 'es') return 'Spanish'
        if (lan === 'el') return 'Greek'
        if (lan === 'ru') return 'Russian'
        if (lan === 'ja') return 'Japanese'
        if (lan === 'ar') return 'Arabic'
      }

      const embed = new EmbedBuilder()
        .setColor(colors.green)
        .addFields({
          name: `Your text: `,
          value: `\`\`\` ${text}\`\`\``,
          inline: false,
        })
        .addFields({
          name: `Translation (${getLanguage(lan)}): `,
          value: `\`\`\` ${translated.text}\`\`\``,
          inline: false,
        })

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
