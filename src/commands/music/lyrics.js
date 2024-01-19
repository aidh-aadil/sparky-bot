const { EmbedBuilder, SlashCommandBuilder } = require('@discordjs/builders')
const { colors } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lyrics')
    .setDMPermission(false)
    .setDescription('Fetch lyrics for a song')
    .addStringOption((option) =>
      option
        .setName('song')
        .setDescription('What song do you want?')
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      await interaction.deferReply()

      const song = await interaction.options.getString('song')

      const url = await fetch(`https://api.popcat.xyz/lyrics?song=${song}`)

      let info = await url.json()

      const errEmbed = new EmbedBuilder()
        .setTitle(`${song}: ${info['error']}`)
        .setColor(colors.red)
        .setFooter({
          text: `Not the song you are looking for? Try typing the artist along with the song`,
        })

      if (info['error']) {
        await interaction.editReply({ embeds: [errEmbed] })
        return
      }

      let title = info['title']
      let image = info['image']
      let artist = info['artist']
      let lyrics = info['lyrics']

      const limitEmbed = new EmbedBuilder().setColor(colors.red).setFooter({
        text: `Damn! Looks like the lyrics of "${song}" are too long.`,
      })

      if (lyrics.length > 4096) {
        await interaction.editReply({ embeds: [limitEmbed] })
        return
      }

      const embed = new EmbedBuilder()
        .setTitle(`${title}`)
        .setColor(colors.blue)
        .setThumbnail(image)
        .setDescription(lyrics)
        .setFooter({
          text: `Artist: ${artist}`,
          iconURL: `${image}`,
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
