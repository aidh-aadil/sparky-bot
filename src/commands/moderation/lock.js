const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ChannelType,
} = require('discord.js')
const { colors } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Lock a channel')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('The channel you want to lock')
        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
        .setRequired(false)
    ),
  async execute(interaction) {
    try {
      let channel =
        interaction.options.getChannel('channel') || interaction.channel

      await interaction.deferReply()

      channel.permissionOverwrites.create(interaction.guild.id, {
        SendMessages: false,
      })

      const embed = new EmbedBuilder().setColor(colors.red).setFooter({
        text: `Moderator: ${interaction.user.username}`,
        iconURL: `${interaction.user.avatarURL()}`,
      })

      await interaction.editReply({
        content: `${channel} has been locked`,
        embeds: [embed],
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
