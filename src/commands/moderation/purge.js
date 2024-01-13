const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ChannelType,
} = require('discord.js')
const { colors } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Clear messages in a channel')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption((option) =>
      option
        .setName('amount')
        .setDescription('The amount of messages')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    )
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('The channel you want to lock')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false)
    ),
  async execute(interaction) {
    let channel =
      interaction.options.getChannel('channel') || interaction.channel
    const amount = interaction.options.getInteger('amount')

    try {
      await channel.bulkDelete(amount).catch((err) => {
        return
      })

      await interaction.deferReply()

      const embed = new EmbedBuilder()
        .setColor(colors.green)
        .setDescription(
          `Successfully deleted \`${amount}\` messages in ${channel}`
        )

      await interaction.editReply({ embeds: [embed] })
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
