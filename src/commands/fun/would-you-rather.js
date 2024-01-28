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
        .setThumbnail(
          'https://cdn.discordapp.com/attachments/1191439831633498176/1201093173846478868/VzOrijvOBa8SolzucMptZrXlWHAFXjIJSMn2xAvMJ_G8f0hJoPjnOOBqU2Jc6fn39Mw240-h480-rw.png?ex=65c8902f&is=65b61b2f&hm=ffb33ab22f834042c98f03e0d1013e53f6d49673340241a60d1db807e612ba19&'
        )
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
