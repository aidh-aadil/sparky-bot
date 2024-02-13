const { Events } = require('discord.js')

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return

    const command = interaction.client.commands.get(interaction.commandName)

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`)
      return
    }

    try {
      await command.execute(interaction)
    } catch (error) {
      console.error(error)
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content:
            'You are unable to interact with this command due to a minor issue. This may cause due to traffic when processing requests',
          ephemeral: true,
        })
      } else {
        await interaction.reply({
          content:
            'You are unable to interact with this command due to a minor issue. This may cause due to traffic when processing requests',
          ephemeral: true,
        })
      }
    }
  },
}
