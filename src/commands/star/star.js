const { EmbedBuilder, SlashCommandBuilder } = require('@discordjs/builders')
const UserProfile = require('../../schemas/userProfile')
const { colors, emotes } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('star')
    .setDescription('Give a star to a user')
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('Select the user you want to star')
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      await interaction.deferReply()

      const targetUser = interaction.options.getMember('user')
      const targetUserID = targetUser.id

      let userProfile = await UserProfile.findOne({
        userId: interaction.member.id,
        guildId: interaction.guild.id,
      })

      if (!targetUser) {
        return await interaction.editReply('That user is not in this server')
      }

      if (targetUserID === interaction.member.id) {
        return await interaction.editReply('You cannot star yourself')
      }

      if (targetUser.user.bot) {
        return await interaction.editReply('You cannot star a bot')
      }

      if (userProfile) {
        const lastStarGivenDate = userProfile.lastStarGiven?.toDateString()
        const currentDate = new Date().toDateString()

        if (lastStarGivenDate === currentDate) {
          await interaction.editReply(
            `You have already given a star today. You can star someone again in \`${countdownToNextDay()}\``
          )
          return
        }
      } else {
        userProfile = new UserProfile({
          userId: interaction.member.id,
          guildId: interaction.guild.id,
        })
      }

      let targetUserProfile = await UserProfile.findOne({
        userId: targetUserID,
        guildId: interaction.guild.id,
      })

      if (!targetUserProfile) {
        targetUserProfile = new UserProfile({
          userId: targetUserID,
          guildId: interaction.guild.id,
        })
      }

      targetUserProfile.stars += 1
      userProfile.lastStarGiven = new Date()

      await userProfile.save()
      await targetUserProfile.save()

      const embed = new EmbedBuilder()
        .setColor(colors.blue)
        .setTitle('Give a star!')
        .setDescription(
          `You gave a star to ${targetUser} (${targetUserProfile.stars} ${emotes.star})`
        )
        .setThumbnail(
          'https://cdn.discordapp.com/emojis/1208647136883777616.png'
        )

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

function countdownToNextDay() {
  const now = new Date()

  const millisecondsInADay = 24 * 60 * 60 * 1000
  const nextDay = new Date(now.getTime() + millisecondsInADay)
  nextDay.setHours(0, 0, 0, 0)

  const timeRemaining = nextDay - now

  const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60))
  const minutesRemaining = Math.floor(
    (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
  )
  const secondsRemaining = Math.floor((timeRemaining % (1000 * 60)) / 1000)

  return `${hoursRemaining}h ${minutesRemaining}m ${secondsRemaining}s`
}
