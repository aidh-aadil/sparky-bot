const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require('discord.js')
const { colors } = require('../../../config.json')
module.exports = {
  data: new SlashCommandBuilder()
    .setName('let-me-google-that')
    .setDescription('Search google for something')
    .addStringOption((option) =>
      option
        .setName('search')
        .setDescription('What do you want to search?')
        .setRequired(true)
    ),
  async execute(interaction) {
    const topic = interaction.options.getString('search').slice().split(' ')
    const search = topic.join('+')

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Google Search')
        .setStyle(ButtonStyle.Link)
        .setURL(`https://letmegooglethat.com/?q=${search}`)
    )

    const embed = new EmbedBuilder()
      .setDescription(
        `[**Let me Google that for you!**](https://letmegooglethat.com/?q=${search})\n\nFor all those people that find it more convenient to bother you with their questions than to Google it for themselves ;)`
      )
      .setThumbnail(`http://letmegooglethat.com/android-chrome-192x192.png`)
      .setColor(colors.invis)
    interaction.reply({
      content: `https://letmegooglethat.com/?q=${search}`,
      embeds: [embed],
      components: [row],
    })
  },
}
