const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { colors } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('would-you-rather')
    .setDMPermission(false)
    .setDescription('Get a would you rather question'),
  async execute(interaction) {
    try {
      await interaction.deferReply()

      let url = await fetch(`https://api.popcat.xyz/wyr`)

      let info = await url.json()
      let option1 = info['ops1']
      let option2 = info['ops2']

      const errEmbed = new EmbedBuilder().setColor(colors.red)

      if (info['error']) {
        errEmbed.setDescription(info['error'])
        return await interaction.editReply({ embeds: [errEmbed] })
      }

      const embed = new EmbedBuilder()
        .setColor(colors.purple)
        .setTitle(`Would you rather?`)
        .setThumbnail('https://i.imgur.com/Vierq0A.png')
        .setDescription(`1. **${option1}**\n or \n2. **${option2}**`)

      const reply = await interaction.editReply({ embeds: [embed] })

      await reply.react('1️⃣').catch(console.error)
      await reply.react('2️⃣').catch(console.error)
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
