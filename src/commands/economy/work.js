const { EmbedBuilder, SlashCommandBuilder } = require('@discordjs/builders')
const Cooldown = require('../../schemas/Cooldown')
const UserProfile = require('../../schemas/userProfile')
const { colors, currencyEmotes } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('work')
    .setDMPermission(false)
    .setDescription('Get some bot currency'),

  async execute(interaction) {
    try {
      await interaction.deferReply()

      const commandName = 'work'
      const userId = interaction.user.id
      const guildId = interaction.guild.id

      let cooldown = await Cooldown.findOne({ commandName, userId, guildId })

      if (cooldown && Date.now() < cooldown.endsAt) {
        const cooldownEmbed = new EmbedBuilder()
          .setColor(colors.red)
          .setDescription('Woah! Calm down there. You are on cooldown.')
          .setFooter({
            text: `Cooldown ends in ${getCooldownRemaining(
              cooldown.endsAt,
              Date.now()
            )}`,
          })
        await interaction.editReply({
          embeds: [cooldownEmbed],
        })
        return
      }

      if (!cooldown) {
        cooldown = new Cooldown({ commandName, userId, guildId })
      }

      const amount = getRandomNumber(100, 500)

      let userProfile = await UserProfile.findOne({ userId, guildId }).select(
        'userId guildId balance'
      )

      if (!userProfile) {
        userProfile = new UserProfile({ userId, guildId })
      }

      userProfile.balance += amount
      cooldown.endsAt = Date.now() + 21_600_000

      await Promise.all([cooldown.save(), userProfile.save()])

      const workResponses = [
        `You perfected the art of procrastination and received ${currencyEmotes.money} ${amount}.`,
        `My code malfunctioned and accidentally credited your account with ${currencyEmotes.money} ${amount}. Don't tell the developer...`,
        `Your dad gifted you ${currencyEmotes.money} ${amount}.`,
        `You invested in crypto and received ${currencyEmotes.money} ${amount}.`,
        `You broke into your own house and found ${currencyEmotes.money} ${amount}.`,
        `You snuck into a millionaire's party. He paid you to leave. Easy ${currencyEmotes.money} ${amount}.`,
        `I spilled coffee on my circuits and somehow managed to generate ${currencyEmotes.money} ${amount} for you. Don't expect this to happen again.`,
        `My developer got generous and sent you ${currencyEmotes.money} ${amount}.`,
        `Wow, you actually worked. Here's your ${currencyEmotes.money} ${amount} (it's not much, but hey, capitalism).`,
        `Another day, another dollar ${currencyEmotes.money} ${amount}`,
      ]

      function getRandomWorkResponse() {
        const randomIndex = Math.floor(Math.random() * workResponses.length)
        return workResponses[randomIndex]
      }

      const workCollectedEmbed = new EmbedBuilder()
        .setColor(colors.purple)
        .setDescription(getRandomWorkResponse())

      await interaction.editReply({
        embeds: [workCollectedEmbed],
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

function getRandomNumber(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getCooldownRemaining(cooldownEnd, currentTime) {
  const timeRemaining = cooldownEnd - currentTime

  const hours = Math.floor(timeRemaining / (1000 * 60 * 60))
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000)

  return `${hours}h ${minutes}m ${seconds}s`
}
