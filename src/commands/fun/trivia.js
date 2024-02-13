const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require('discord.js')
const { colors } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('trivia')
    .setDescription('Get a trivia question')
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName('difficulty')
        .setDescription('Select the difficulty of the question')
        .addChoices(
          { name: 'Any', value: 'any' },
          { name: 'Easy', value: 'easy' },
          { name: 'Medium', value: 'medium' },
          { name: 'Hard', value: 'hard' }
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('category')
        .setDescription('Select the category of the question')
        .addChoices(
          { name: 'Any', value: 'any' },
          { name: 'General Knowledge', value: '9' },
          { name: 'Entertainment: Books', value: '10' },
          { name: 'Entertainment: Films', value: '11' },
          { name: 'Entertainment: Music', value: '12' },
          { name: 'Entertainment: Musicals & Theatres', value: '13' },
          { name: 'Entertainment: Television', value: '14' },
          { name: 'Entertainment: Video Games', value: '15' },
          { name: 'Entertainment: Board Games', value: '16' },
          { name: 'Science & Nature', value: '17' },
          { name: 'Science: Computers', value: '18' },
          { name: 'Science: Mathematics', value: '19' },
          { name: 'Mythology', value: '20' },
          { name: 'Sports', value: '21' },
          { name: 'Geography', value: '22' },
          { name: 'History', value: '23' },
          { name: 'Politics', value: '24' },
          { name: 'Arts', value: '25' },
          { name: 'Celebrities', value: '26' },
          { name: 'Animals', value: '27' },
          { name: 'Vehicles', value: '28' },
          { name: 'Entertainment: Comics', value: '29' },
          { name: 'Science: Gadgets', value: '30' },
          { name: 'Entertainment: Japanese Anime & Manga', value: '31' },
          { name: 'Entertainment: Cartoon & Animation', value: '32' }
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply()

    const selectedDifficulty = await interaction.options.getString('difficulty')
    const selectedCategory = await interaction.options.getString('category')

    let url
    if (selectedDifficulty === 'any' && selectedCategory === 'any') {
      url = `https://opentdb.com/api.php?amount=1&type=multiple&encode=url3986`
    } else if (selectedDifficulty === 'any') {
      url = `https://opentdb.com/api.php?amount=1&category=${selectedCategory}&type=multiple&encode=url3986`
    } else if (selectedCategory === 'any') {
      url = `https://opentdb.com/api.php?amount=1&difficulty=${selectedDifficulty}&type=multiple&encode=url3986`
    } else {
      url = `https://opentdb.com/api.php?amount=1&category=${selectedCategory}&difficulty=${selectedDifficulty}&type=multiple&encode=url3986`
    }

    const response = await fetch(url)
    const info = await response.json()

    const question = decodeURIComponent(info.results[0].question)
    const category = decodeURIComponent(info.results[0].category)
    const difficulty = decodeURIComponent(info.results[0].difficulty)
    const correctAnswer = decodeURIComponent(info.results[0].correct_answer)
    const incorrectAnswers = info.results[0].incorrect_answers.map((answer) =>
      decodeURIComponent(answer)
    )

    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
      }
      return array
    }

    const allAnswers = shuffleArray([correctAnswer, ...incorrectAnswers])

    const embed = new EmbedBuilder()
      .setColor(colors.invis)
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.avatarURL(),
      })
      .setTitle(`${category} (${difficulty})`)
      .setFooter({
        text: `You have 15 seconds to pick the correct answer`,
      })
      .setDescription(
        `${question}\n\n${allAnswers
          .map((answer, index) => `${index + 1}. ${answer}`)
          .join('\n')}`
      )

    const buttonOption1 = new ButtonBuilder()
      .setCustomId(`${allAnswers[0]}`)
      .setLabel(`${allAnswers[0]}`)
      .setEmoji(`1️⃣`)
      .setStyle(ButtonStyle.Secondary)

    const buttonOption2 = new ButtonBuilder()
      .setCustomId(`${allAnswers[1]}`)
      .setLabel(`${allAnswers[1]}`)
      .setEmoji(`2️⃣`)
      .setStyle(ButtonStyle.Secondary)

    const buttonOption3 = new ButtonBuilder()
      .setCustomId(`${allAnswers[2]}`)
      .setLabel(`${allAnswers[2]}`)
      .setEmoji(`3️⃣`)
      .setStyle(ButtonStyle.Secondary)

    const buttonOption4 = new ButtonBuilder()
      .setCustomId(`${allAnswers[3]}`)
      .setLabel(`${allAnswers[3]}`)
      .setEmoji(`4️⃣`)
      .setStyle(ButtonStyle.Secondary)

    const row = new ActionRowBuilder().addComponents(
      buttonOption1,
      buttonOption2,
      buttonOption3,
      buttonOption4
    )

    const reply = await interaction.editReply({
      embeds: [embed],
      components: [row],
    })
    try {
      const userInteraction = await reply.awaitMessageComponent({
        filter: (i) => i.user.id === interaction.user.id,
        time: 15_000,
      })

      const userAnswer = userInteraction.customId

      if (userAnswer === correctAnswer) {
        embed
          .setColor(colors.green)
          .setFooter({
            text: `You got it right!`,
          })
          .setDescription(
            `${question}\n\nYou're answer is correct!\nIt is ${correctAnswer}`
          )

        await reply.edit({ embeds: [embed], components: [] })
        await reply.react('✅')
      } else {
        embed
          .setColor(colors.red)
          .setFooter({
            text: `You got it wrong!`,
          })
          .setDescription(
            `${question}\n\nYou're answer ${userAnswer} is incorrect!\nThe correct answer is ${correctAnswer}`
          )
        await reply.edit({ embeds: [embed], components: [] })
        await reply.react('❌')
      }
    } catch (error) {
      embed
        .setColor(colors.red)
        .setFooter({
          text: `You failed to answer within 15 seconds!`,
        })
        .setDescription(`${question}\n\nThe answer is ${correctAnswer}`)
      await reply.edit({ embeds: [embed], components: [] })
      await reply.react('⌛')
    }
  },
}
