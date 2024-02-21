const { EmbedBuilder, SlashCommandBuilder } = require('discord.js')
const { colors } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('github-repo')
    .setDMPermission(false)
    .setDescription('Fetch some information about a github repository')
    .addStringOption((option) =>
      option
        .setName('owner')
        .setDescription('The username of the repository owner')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('repository')
        .setDescription('The name of the repository you want')
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      await interaction.deferReply()

      const owner = await interaction.options.getString('owner')
      const repository = await interaction.options.getString('repository')

      const url = await fetch(
        `https://api.github.com/repos/${owner}/${repository}`
      )

      let info = await url.json()

      if (info['message']) {
        return await interaction.editReply(
          `Couldn't find the repository according to the given data`
        )
      }

      const name = info['name']
      const repoUrl = info['html_url']
      const thumbnail = info['owner']['avatar_url']
      const visibility = info['visibility']
      const description = info['description']
      const repoOwner = info['owner']['login']
      const repoOwnerType = info['owner']['type']
      const repoOwnerUrl = info['owner']['html_url']
      const isFork = info['fork']
      const forksCount = info['forks_count']
      const openIssuesCount = info['open_issues_count']
      const createdAt = info['created_at']
      const updatedAt = info['updated_at']
      const lastPushedAt = info['pushed_at']
      const stars = info['stargazers_count']
      const language = info['language']
      const isArchived = info['archived']
      const size = info['size']
      const defaultBranch = info['default_branch']

      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short',
      }
      const createdAtDate = new Date(createdAt)
      const formattedCreatedAtDate = createdAtDate.toLocaleString(
        'en-US',
        options
      )

      const updatedAtDate = new Date(updatedAt)
      const formattedUpdatedAtDate = updatedAtDate.toLocaleString(
        'en-US',
        options
      )

      const lastPushedDate = new Date(lastPushedAt)
      const formattedLastPushedDate = lastPushedDate.toLocaleString(
        'en-US',
        options
      )

      const embed = new EmbedBuilder()
        .setColor(colors.invis)
        .setDescription(`**[${name}](${repoUrl})**`)
        .setThumbnail(thumbnail)
        .addFields([
          { name: 'Description', value: description },
          { name: 'Visibility', value: visibility, inline: true },
          {
            name: 'Owner',
            value: `[${repoOwner}](${repoOwnerUrl})`,
            inline: true,
          },
          { name: 'Owner type', value: repoOwnerType, inline: true },
          {
            name: 'Language',
            value: language ? language : 'None',
            inline: true,
          },
          { name: 'Stars', value: `${stars}`, inline: true },
          { name: 'Size', value: `${size}KB`, inline: true },
          { name: 'Default branch', value: defaultBranch, inline: true },
          { name: 'Forks', value: `${forksCount}`, inline: true },
          { name: 'Open issues', value: `${openIssuesCount}`, inline: true },
          { name: 'Archived?', value: `${isArchived}`, inline: true },
          { name: 'Fork?', value: `${isFork}`, inline: true },
          {
            name: 'License',
            value: info['license'] ? info['license']['spdx_id'] : 'None',
            inline: true,
          },
          { name: 'Created on', value: formattedCreatedAtDate },
          { name: 'Updated on', value: formattedUpdatedAtDate },
          { name: 'Last push', value: formattedLastPushedDate },
        ])

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
