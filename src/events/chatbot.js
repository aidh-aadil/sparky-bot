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

        if (!prompt) return

        const result = await model.generateContent(prompt)
        const response = await result.response
        let text = response.text()

        if (text.length > 6000) {
          await message.reply(
            'The response exceeds the discord maximum character limitations'
          )
          return
        }

        const embeds = []

        // Chunking down the text if it exceeds 2000 characters
        while (text.length > 0) {
          const chunk = text.substring(0, 2000)
          text = text.substring(2000)

          const embed = new EmbedBuilder()
            .setColor(colors.purple)
            .setDescription(chunk)

          if (text.length === 0) {
            embed.setFooter({ text: 'Generated by Gemini LLM' })
          }

          embeds.push(embed)
        }

        await message.reply({ embeds: embeds })
      } catch (error) {
        console.error(error)
        await message.reply('Oops! There was an error')
      }
    }
  },
}
