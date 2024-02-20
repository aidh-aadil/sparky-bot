const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js')
const { emotes } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('source')
    .setDMPermission(false)
    .setDescription('View the source code for the bot'),

  async execute(interaction) {
    try {
      await interaction.deferReply()

      const repoBtn = new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel('Star my repository')
        .setEmoji(emotes.star)
        .setURL('https://github.com/aidh-aadil/sparky-bot')

      const ownerBtn = new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setEmoji('<:github:1209105862694801468>')
        .setLabel('Follow me on GitHub')
        .setURL('https://github.com/aidh-aadil')

      const twitterBtn = new ButtonBuilder()
        .setLabel('Follow me on X/twitter')
        .setURL('https://twitter.com/aidhaadil')
        .setEmoji('<:twitter:1209294900453965824> ')
        .setStyle(ButtonStyle.Link)

      const row = new ActionRowBuilder().addComponents(
        repoBtn,
        ownerBtn,
        twitterBtn
      )

      await interaction.editReply({
        content: `[This bot was made with ❤️ by Aidh Aadil.](https://github.com/aidh-aadil/sparky-bot)`,
        components: [row],
      })
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
