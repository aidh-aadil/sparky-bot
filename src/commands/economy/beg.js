const { EmbedBuilder, SlashCommandBuilder } = require('@discordjs/builders')
const Cooldown = require('../../schemas/Cooldown')
const UserProfile = require('../../schemas/userProfile')
const { colors, currencyEmotes } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('beg')
    .setDMPermission(false)
    .setDescription('Beg for some bot currency'),

  async execute(interaction) {
    try {
      await interaction.deferReply()

      const commandName = 'beg'
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

      const chance = getRandomNumber(0, 100)

      const begEmbed = new EmbedBuilder()

      if (chance < 30) {
        begEmbed
          .setColor(colors.red)
          .setDescription(`Unlucky! You did not receive any money `)
          .setFooter({
            text: `Imagine begging lol`,
          })

        return interaction.editReply({ embeds: [begEmbed] })
      }

      const amount = getRandomNumber(50, 150)

      let userProfile = await UserProfile.findOne({ userId, guildId }).select(
        'userId guildId balance'
      )

      if (!userProfile) {
        userProfile = new UserProfile({ userId, guildId })
      }

      userProfile.balance += amount
      cooldown.endsAt = Date.now() + 120_000

      await Promise.all([cooldown.save(), userProfile.save()])

      begEmbed
        .setDescription(
          `You begged for some money and received ${currencyEmotes.money} ${amount}`
        )
        .setColor(colors.purple)

      await interaction.editReply({
        embeds: [begEmbed],
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
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getCooldownRemaining(cooldownEnd, currentTime) {
  const timeRemaining = cooldownEnd - currentTime

  const hours = Math.floor(timeRemaining / (1000 * 60 * 60))
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000)

  return `${hours}h ${minutes}m ${seconds}s`
}
