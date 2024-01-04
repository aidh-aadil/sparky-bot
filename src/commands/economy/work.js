const { EmbedBuilder, SlashCommandBuilder } = require('@discordjs/builders')
const Cooldown = require('../../../schemas/Cooldown')
const UserProfile = require('../../../schemas/userProfile')
const { colors } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('work')
    .setDescription('Get some bot-cash'),

  async execute(interaction) {
    try {
      if (!interaction.inGuild()) {
        await interaction.reply({
          content: 'This command should be ran inside a server',
          ephemeral: true,
        })
        return
      }

      await interaction.deferReply()

      const commandName = 'work'
      const userId = interaction.user.id
      const guildId = interaction.guild.id

      let cooldown = await Cooldown.findOne({ commandName, userId, guildId })

      const cooldownEmbed = new EmbedBuilder()
        .setColor(colors.purple)
        .setDescription('Woah! Calm down there. You are on cooldown.')
        .setFooter(
          `Cooldown ends in ${getCooldownRemaining(
            cooldown.endsAt,
            Date.now()
          )}`
        )

      if (cooldown && Date.now() < cooldown.endsAt) {
        await interaction.editReply({
          embeds: [cooldownEmbed],
        })
        return
      }

      if (!cooldown) {
        cooldown = new Cooldown({ commandName, userId, guildId })
      }

      const noCashResponses = [
        'Wow, you must be the richest broke person around!',
        'Cash? Who needs it? Not you, apparently!',
        'You have hit the jackpot... of nothing!',
        'Cash alert: Not found. Keep trying!',
        'Zero cash detected. Keep trying your luck!',
        'Cashless wonder! Keep up the good work!',
        "No cash? Perfect timing to join the 'Broke but Happy' club!",
      ]

      function getRandomNoCashResponse() {
        const randomIndex = Math.floor(Math.random() * noCashResponses.length)
        return noCashResponses[randomIndex]
      }

      const noCashEmbed = new EmbedBuilder()
        .setColor(colors.purple)
        .setTitle('Looks like you received nothing!')
        .setDescription(getRandomNoCashResponse)

      const chance = getRandomNumber(1, 100)

      if (chance < 30) {
        await interaction.editReply({
          embeds: [noCashEmbed],
        })

        cooldown.endsAt = Date.now() + 21_600_000
        await cooldown.save()
        return
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
        `You perfected the art of procrastination and received :moneybag: ${amount}.`,
        `You mastered the ancient technique of stared at the screen and pretended to be productive. You received :moneybag: ${amount}.`,
        `You made an industry-scale application using only HTML. You received ${amount} (from your mom).`,
        `Your dad gifted you ${amount}.`,
        `You invested in crypto and received ${amount}. (Just a matter of time until you lose it all)`,
        `You broke into your own house and found ${amount}`,
      ]

      function getRandomWorkResponse() {
        const randomIndex = Math.floor(Math.random() * workResponses.length)
        return workResponses[randomIndex]
      }

      const workCollectedEmbed = new EmbedBuilder()
        .setColor(colors.purple)
        .setDescription(getRandomWorkResponse())
        .setFooter(`Tip:  I am open-sourced.`)

      await interaction.editReply({
        embeds: [workCollectedEmbed],
      })
    } catch (error) {
      console.log(error)
    }
  },
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getCooldownRemaining(cooldownEnd, currentTime) {
  const timeRemaining = cooldownEnd - currentTime

  const hours = Math.floor(timeRemaining / (1000 * 60 * 60))
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000)

  return `${hours}h ${minutes}m ${seconds}s`
}
