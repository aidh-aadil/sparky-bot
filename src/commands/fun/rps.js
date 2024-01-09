const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require('discord.js')
const { colors } = require('../../../config.json')

const choices = [
  { name: 'Rock', emoji: '🪨', beats: 'Scissors' },
  { name: 'Paper', emoji: '📄', beats: 'Rock' },
  { name: 'Scissors', emoji: '✂️', beats: 'Paper' },
]

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rps')
    .setDescription('Play a game of rock paper scissors')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user you want to challenge')
        .setRequired(true)
    ),
  async execute(interaction) {
    if (!interaction.inGuild()) {
      await interaction.reply({
        content: 'Use this command in a server',
        ephemeral: true,
      })
      return
    }
    try {
      await interaction.deferReply()

      const targetUser = await interaction.options.getUser('user')

      if (targetUser.id === interaction.user.id) {
        interaction.editReply(
          'You cannot play with yourself. Go make some friends.'
        )
        return
      }

      if (targetUser.bot) {
        interaction.editReply('You cannot play against a bot')
        return
      }

      const embed = new EmbedBuilder()
        .setColor(colors.invis)
        .setTitle('Rock Paper Scissors!')
        .setDescription(`It's ${targetUser}'s turn...`)

      const buttons = choices.map((choice) => {
        return new ButtonBuilder()
          .setLabel(choice.name)
          .setEmoji(choice.emoji)
          .setCustomId(choice.name)
          .setStyle(ButtonStyle.Secondary)
      })

      const row = new ActionRowBuilder().addComponents(buttons)

      const reply = await interaction.editReply({
        content: `${interaction.user} has challenged ${targetUser} to a game of rock paper scissors.`,
        embeds: [embed],
        components: [row],
      })

      const targetUserInteraction = await reply
        .awaitMessageComponent({
          filter: (i) => i.user.id === targetUser.id,
          time: 120_000,
        })
        .catch(async (error) => {
          embed.setColor(colors.red)
          embed.setDescription(
            `The game canceled! ${targetUser} did not respond in time.`
          )
          await reply.edit({ embeds: [embed], components: [] })
        })
      if (!targetUserInteraction) return

      const targetUserChoice = choices.find(
        (choice) => choice.name === targetUserInteraction.customId
      )

      await targetUserInteraction.reply({
        content: `You picked **${targetUserChoice.name} ${targetUserChoice.emoji}**`,
        ephemeral: true,
      })

      embed.setDescription(`Now it's ${interaction.user}'s turn...`)
      await reply.edit({
        content: `${targetUser} picked his choice.`,
        embeds: [embed],
      })

      const initialUserInteraction = await reply
        .awaitMessageComponent({
          filter: (i) => i.user.id === interaction.user.id,
          time: 60_000,
        })
        .catch(async (error) => {
          embed.setColor(colors.red)
          embed.setDescription(
            `The game canceled! ${interaction.user} did not respond in time.`
          )
          await reply.edit({ embeds: [embed], components: [] })
        })
      if (!initialUserInteraction) return

      const initialUserChoice = choices.find(
        (choice) => choice.name === initialUserInteraction.customId
      )

      let result

      if (targetUserChoice.beats === initialUserChoice.name) {
        result = `${targetUser} won!`
      }
      if (initialUserChoice.beats === targetUserChoice.name) {
        result = `${interaction.user} won!`
      }
      if (targetUserChoice.name === initialUserChoice.name) {
        result = `It's a tie!`
      }

      embed.setDescription(
        `${targetUser} picked ${targetUserChoice.name} ${targetUserChoice.emoji}\n${interaction.user} picked ${initialUserChoice.name} ${initialUserChoice.emoji}\n\n**${result}**`
      )
      await reply.edit({ content: ``, embeds: [embed], components: [] })
    } catch (error) {
      console.log(error)
    }
  },
}
