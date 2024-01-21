const { SlashCommandBuilder } = require('@discordjs/builders')
const { EmbedBuilder } = require('discord.js')
const { colors } = require('../../../config.json')
const { default: axios } = require('axios')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('emoji-enlarge')
    .setDescription('Enlarges an emoji')
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName('emoji')
        .setDescription('The emoji you want to enlarge')
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      await interaction.deferReply()

      let emoji = interaction.options.getString('emoji')?.trim()

      if (emoji.startsWith('<') && emoji.endsWith('>')) {
        const id = emoji.match(/\d{15,}/g)[0]

        const type = await axios
          .get(`https://cdn.discordapp.com/emojis/${id}.gif`)
          .then((image) => {
            if (image) return 'gif'
            else return 'png'
          })
          .catch((err) => {
            return 'png'
          })
        emoji = `https://cdn.discordapp.com/emojis/${id}.${type}?quality=lossless`
      }

      const errEmbed = new EmbedBuilder()
        .setColor(colors.red)
        .setTitle('Invalid Emoji!')
        .setFooter({
          text: `Please provide a valid emoji or an emoji URL`,
        })

      if (!emoji.startsWith('http')) {
        return await interaction.editReply({
          embeds: [errEmbed],
        })
      }

      if (!emoji.startsWith('https')) {
        return await interaction.editReply({
          embeds: [errEmbed],
        })
      }

      const embed = new EmbedBuilder()
        .setColor(colors.green)
        .setDescription('**Emoji Enlarged Successfully!**')
        .setImage(emoji)

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
