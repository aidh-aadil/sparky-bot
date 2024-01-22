const { EmbedBuilder, SlashCommandBuilder } = require('@discordjs/builders')
const { colors } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('movie-info')
    .setDMPermission(false)
    .setDescription('Fetch some information about a movie')
    .addStringOption((option) =>
      option
        .setName('movie')
        .setDescription('The name of the movie you want')
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      await interaction.deferReply()

      const movie = await interaction.options.getString('movie')

      const url = await fetch(`https://api.popcat.xyz/imdb?q=${movie}`)

      let info = await url.json()

      const errEmbed = new EmbedBuilder()
        .setColor(colors.red)
        .setDescription(`**${movie}**: Movie not found!`)
        .setFooter({ text: `Try to be more specific` })

      if (info['error']) {
        return await interaction.editReply({ embeds: [errEmbed] })
      }

      const title = info['title']
      const rating = info['rating']
      const plot = info['plot']
      const year = info['year']
      const genres = info['genres']
      const director = info['director']
      const writer = info['writer']
      const mainActors = info['actors']
      const awards = info['awards']
      const poster = info['poster']
      const runtime = info['runtime']

      const embed = new EmbedBuilder()
        .setColor(colors.yellow)
        .setThumbnail(poster)
        .setTitle(`${title} (${year})`)
        .setDescription(plot)
        .setFields([
          { name: `Genre`, value: genres },
          { name: `Director`, value: director },
          { name: `Actors`, value: mainActors },
          { name: `Writers`, value: writer },
          { name: `Awards`, value: awards },
        ])
        .setFooter({ text: `Rating: ${rating}/10 | Runtime: ${runtime}` })

      await interaction.editReply({
        embeds: [embed],
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
