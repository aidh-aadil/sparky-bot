const { EmbedBuilder, SlashCommandBuilder } = require('@discordjs/builders')
const UserProfile = require('../../../schemas/userProfile')
const { colors, currencyEmotes } = require('../../../config.json')

const dailyAmount = 1000

module.exports = {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDMPermission(false)
    .setDescription('Collect your daily reward'),

  async execute(interaction) {
    try {

      await interaction.deferReply()

      let userProfile = await UserProfile.findOne({
        userId: interaction.member.id,
        guildId: interaction.guild.id,
      })

      const dailyAlreadyCollectedEmbed = new EmbedBuilder()
        .setColor(colors.purple)
        .setDescription(
          'You have already collected your daily reward for today.'
        )
        .setFooter({
          text: `Next daily in ${countdownToNextDay()}`,
        })

      if (userProfile) {
        const lastDailyDate = userProfile.lastDailyCollected?.toDateString()
        const currentDate = new Date().toDateString()

        if (lastDailyDate === currentDate) {
          await interaction.editReply({
            embeds: [dailyAlreadyCollectedEmbed],
          })
          return
        }
      } else {
        userProfile = new UserProfile({
          userId: interaction.member.id,
          guildId: interaction.guild.id,
        })
      }

      userProfile.balance += dailyAmount
      userProfile.lastDailyCollected = new Date()

      await userProfile.save()

      const collectDailyEmbed = new EmbedBuilder()
        .setColor(colors.purple)
        .setTitle('Collected your daily reward!')
        .setDescription(
          `You received: ${currencyEmotes.money} ${dailyAmount}.\nNew balance: ${currencyEmotes.money} ${userProfile.balance}`
        )
        .setFooter({
          text: `Next daily in ${countdownToNextDay()}`,
        })

      await interaction.editReply({
        embeds: [collectDailyEmbed],
      })
    } catch (error) {
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
