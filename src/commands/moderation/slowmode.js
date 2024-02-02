const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ChannelType,
} = require('discord.js')
const { colors } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Set slowmode for a channel')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addStringOption((option) =>
      option
        .setName('duration')
        .setDescription('Duration for the slowmode')
        .addChoices(
          { name: 'Off', value: 'off' },
          { name: '5s', value: '5s' },
          { name: '10s', value: '10s' },
          { name: '15s', value: '15s' },
          { name: '30s', value: '30s' },
          { name: '1m', value: '1m' },
          { name: '2m', value: '2m' },
          { name: '5m', value: '5m' },
          { name: '10m', value: '10m' },
          { name: '15m', value: '15m' },
          { name: '30m', value: '30m' },
          { name: '1h', value: '1h' },
          { name: '2h', value: '2h' },
          { name: '6h', value: '6h' }
        )
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('The channel you want to set slowmode')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false)
    ),
  async execute(interaction) {
    try {
      const channel =
        (await interaction.options.getChannel('channel')) || interaction.channel
      const duration = await interaction.options.getString('duration')

      await interaction.deferReply()

      function convertToSeconds(time) {
        const [value, unit] = time.match(/\d+|\D+/g)

        switch (unit) {
          case 's':
            return parseInt(value, 10)
          case 'm':
            return parseInt(value, 10) * 60
          case 'h':
            return parseInt(value, 10) * 3600
        }
      }

      const embed = new EmbedBuilder().setColor(colors.green)

      if (duration === 'off') {
        embed.setDescription(`Slowmode turned off in ${channel}`)
        await channel.setRateLimitPerUser(0)
        return await interaction.editReply({ embeds: [embed] })
      }

      if (channel.rateLimitPerUser === convertToSeconds(duration)) {
        embed.setDescription(
          `Slowmode unchanged in ${channel}: \`${duration}\``
        )

        return await interaction.editReply({
          embeds: [embed],
        })
      }

      await channel.setRateLimitPerUser(convertToSeconds(duration))

      embed.setDescription(
        `Slowmode has been set for \`${duration}\` in ${channel}`
      )

      await interaction.editReply({
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
