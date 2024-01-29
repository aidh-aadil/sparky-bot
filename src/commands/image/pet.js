const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
} = require('discord.js')
const { colors } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pet')
    .setDMPermission(false)
    .setDescription('Generate a pet gif of user')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user you want to pet')
        .setRequired(false)
    ),
  async execute(interaction) {
    try {
      await interaction.deferReply()

      const targetUserID =
        interaction.options.get('user')?.value || interaction.member.id
      const targetUser = await interaction.guild.members.fetch(targetUserID)

      let link = `https://api.popcat.xyz/pet?image=${targetUser.user.avatarURL({
        size: 1024,
        extension: 'png',
      })}`
      const attachment = new AttachmentBuilder(link, {
        name: 'triggered.gif',
      })

      const embed = new EmbedBuilder()
        .setColor(colors.invis)
        .setTitle(`Pet meme of ${targetUser.user.username}`)
        .setImage('attachment://triggered.gif')
      interaction.editReply({ files: [attachment], embeds: [embed] })
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
