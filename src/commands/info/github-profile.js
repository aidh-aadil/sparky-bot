const {
  EmbedBuilder,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js')
const { colors } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('github-profile')
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
      const githubStreak = `https://github-readme-streak-stats.herokuapp.com/?user=${user}&stroke=ffffff&background=1c1917&ring=f97316&fire=f97316&currStreakNum=ffffff&currStreakLabel=f97316&sideNums=ffffff&sideLabels=ffffff&dates=ffffff&hide_border=true`
      const githubStats = `https://github-readme-stats.vercel.app/api?username=${user}&show_icons=true&hide=&count_private=true&title_color=f97316&text_color=ffffff&icon_color=f97316&bg_color=1c1917&hide_border=true&show_icons=true`
      const githubTopLangs = `https://github-readme-stats.vercel.app/api/top-langs/?username=${user}&langs_count=10&title_color=ffffff&text_color=ffffff&icon_color=f97316&bg_color=1c1917&hide_border=true&locale=en&custom_title=Top%20Languages`

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
        month: 'long',
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

      const streakBtn = new ButtonBuilder()
        .setLabel('GitHub Streak')
        .setStyle(ButtonStyle.Link)
        .setURL(githubStreak)

      const statsBtn = new ButtonBuilder()
        .setLabel('GitHub Stats')
        .setStyle(ButtonStyle.Link)
        .setURL(githubStats)

      const topLangBtn = new ButtonBuilder()
        .setLabel('Top Languages')
        .setStyle(ButtonStyle.Link)
        .setURL(githubTopLangs)

      const row = new ActionRowBuilder().addComponents(
        streakBtn,
        statsBtn,
        topLangBtn
      )

      const embed = new EmbedBuilder()
        .setColor(colors.yellow)
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
