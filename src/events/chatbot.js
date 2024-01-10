const { Events, EmbedBuilder } = require('discord.js')
const { colors } = require('../../config.json')
const { GoogleGenerativeAI } = require('@google/generative-ai')
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

module.exports = {
  name: Events.MessageCreate,
  once: false,
  async execute(message) {
    const botMention = `<@${message.client.user.id}>`

    if (message.content.startsWith(botMention)) {
      try {
        // Separating the prompt from the botMention
        const prompt = message.content.slice(botMention.length).trim()

        if (prompt) {
          const result = await model.generateContent(prompt)
          const response = await result.response
          const text = response.text()

          const embed = new EmbedBuilder()
            .setColor(colors.purple)
            .setTitle(`Prompt: ${prompt}`)
            .setDescription(`${text}`)
            .setFooter({ text: `Requested by ${message.author.username}` })

          await message.reply({ embeds: [embed] })
        }
      } catch (error) {
        console.log(error)
      }
    }
  },
}
