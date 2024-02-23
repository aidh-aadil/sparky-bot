const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
} = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('echo')
    .setDescription('Make the bot send a message in the channel ')
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName('message')
        .setDescription('The message you want to send')
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('The channel you want to send the message')
        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
        .setRequired(false)
    ),
  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true })

      let channel =
        interaction.options.getChannel('channel') || interaction.channel
      let message = interaction.options.getString('message')

      if (
        !interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)
      ) {
        return interaction.editReply({
          content:
            'You do not have the Manage Server permission to use this command.',
          ephemeral: true,
        })
      }

      await channel.send(message)
      await interaction.editReply(
        `Your message (${message}) was sent in ${channel}`
      )
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
