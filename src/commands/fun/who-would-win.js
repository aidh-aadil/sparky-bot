const { EmbedBuilder, SlashCommandBuilder } = require('@discordjs/builders')
const { colors } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('who-would-win')
    .setDMPermission(false)
    .setDescription('Generate a WhoWouldWin meme')
    .addUserOption((option) =>
      option
        .setName('user-1')
        .setDescription('The first user for the fight')
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName('user-2')
        .setDescription('The second user for the fight')
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      await interaction.deferReply()

      user1 = await interaction.options.get('user-1')
      user2 = await interaction.options.get('user-2')

      const response = `https://api.popcat.xyz/whowouldwin?image1=${user1.user.avatarURL(
        { extension: 'png' }
      )}&image2=${user2.user.avatarURL({ extension: 'png' })}`

      const embed = new EmbedBuilder()
        .setColor(colors.invis)
        .setDescription(`${user1.user} vs. ${user2.user}`)
        .setImage(response)
        .setFooter({
          text: `Vote for who you think is better`,
        })
      const reply = await interaction.editReply({
        embeds: [embed],
      })

      await reply.react('1️⃣').catch(console.error)
      await reply.react('2️⃣').catch(console.error)
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
