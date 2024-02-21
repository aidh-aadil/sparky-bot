const { EmbedBuilder, SlashCommandBuilder } = require('discord.js')
const { colors } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('github-user')
    .setDMPermission(false)
    .setDescription('Fetch some information about a github user')
    .addStringOption((option) =>
      option
        .setName('user')
        .setDescription('The username of the profile you want')
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      await interaction.deferReply()

      const user = await interaction.options.getString('user')

      const url = await fetch(`https://api.popcat.xyz/github/${user}`)
      let info = await url.json()

      const errEmbed = new EmbedBuilder()
        .setColor(colors.red)
        .setDescription(`**${user}**: ${info['error']}`)

      if (info['error']) {
        return await interaction.editReply({ embeds: [errEmbed] })
      }

      const profileUrl = info['url']
      const thumbnail = info['avatar']
      const name = info['name']
      const company = info['company']
      const blog = info['blog']
      const location = info['location']
      const email = info['email']
      const bio = info['bio']
      const twitter = info['twitter']
      const publicRepos = info['public_repos']
      const publicGists = info['public_gists']
      const followers = info['followers']
      const following = info['following']
      const createdAt = info['created_at']

      const date = new Date(createdAt)

      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short',
      }

      let footer = `${location} | Followers: ${followers} | Following: ${following}`

      if (location === 'Not set')
        footer = `Followers: ${followers} | Following: ${following}`

      const formattedDate = date.toLocaleString('en-US', options)

      const embed = new EmbedBuilder()
        .setColor(colors.invis)
        .setThumbnail(thumbnail)
        .setDescription(`**[${name}](${profileUrl})**`)
        .setFooter({
          text: footer,
        })
        .addFields([
          { name: 'Bio', value: bio },
          { name: 'Company', value: company, inline: true },
          { name: 'Blog', value: blog, inline: true },
          { name: 'Email', value: email, inline: true },
          { name: 'Twitter', value: twitter, inline: true },
          { name: 'Public Repositories', value: publicRepos, inline: true },
          { name: 'Public Gists', value: publicGists, inline: true },
          { name: 'Account Created On', value: formattedDate },
        ])

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
