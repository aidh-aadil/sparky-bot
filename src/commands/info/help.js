const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js')
const fs = require('fs')
const { colors, emotes } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('View the help menu')
    .addStringOption((option) =>
      option
        .setName('category')
        .setRequired(false)
        .setDescription('What command category do you want to view?')
        // Make sure the value of the choices are exactly equal to the folder names
        .addChoices(
          { name: 'Info', value: 'info' },
          { name: 'Fun', value: 'fun' },
          { name: 'Economy', value: 'economy' },
          { name: 'Moderation', value: 'moderation' },
          { name: 'Image Generation', value: 'image' },
          { name: 'Music', value: 'music' },
          { name: 'Star', value: 'star' }
        )
    ),

  async execute(interaction) {
    try {
      await interaction.deferReply()

      const category =
        (await interaction.options.getString('category')) || 'None'

      const infoImage = 'https://i.imgur.com/Q9zmFCj.png'
      const moderationImage = 'https://i.imgur.com/pM0AwRu.png'
      const funImage = 'https://i.imgur.com/9Xe4k8d.png'
      const imageGenerationImage = 'https://i.imgur.com/cl5qBOr.png'
      const musicImage = 'https://i.imgur.com/16w8752.png'
      const economyImage = 'https://i.imgur.com/BD5OKrL.png'
      const starImage = 'https://i.imgur.com/jfxkApk.png'

      function getCategoryNameForMainMenu(choice) {
        // Make sure to update command categories
        if (choice === 'info') return `> ${emotes.info} Info\n> `
        if (choice === 'fun') return `> ${emotes.fun} Fun\n> `
        if (choice === 'economy') return `> ${emotes.economy} Economy\n> `
        if (choice === 'moderation')
          return `> ${emotes.moderation} Moderation\n> `
        if (choice === 'image')
          return `> ${emotes.imageGeneration} Image Generation\n> `
        if (choice === 'music') return `> ${emotes.music} Music \n> `
        if (choice === 'star') return `> ${emotes.star} Star `
      }

      function getCategoryTitle(choice) {
        // Make sure to update command categories
        if (choice === 'info') return `Info`
        if (choice === 'fun') return `Fun`
        if (choice === 'economy') return `Economy`
        if (choice === 'moderation') return `Moderation`
        if (choice === 'image') return `Image Generation`
        if (choice === 'music') return `Music`
        if (choice === 'star') return 'Star'
      }

      function getCategoryImage(choice) {
        // Make sure to update command categories
        if (choice === 'info') return infoImage
        if (choice === 'fun') return funImage
        if (choice === 'economy') return economyImage
        if (choice === 'moderation') return moderationImage
        if (choice === 'image') return imageGenerationImage
        if (choice === 'music') return musicImage
        if (choice === 'star') return starImage
      }

      // Make sure to update command categories
      let infoField = []
      let funField = []
      let economyField = []
      let moderationField = []
      let imageField = []
      let musicField = []
      let starField = []

      for (const [index, folder] of fs
        .readdirSync('./src/commands')
        .entries()) {
        const files = fs
          .readdirSync(`./src/commands/${folder}`)
          .filter((file) => file.endsWith('.js'))

        for (const file of files) {
          const command = require(`./../${folder}/${file}`)
          let name = `${command.data.name}`

          // Handle errors when fetching the command ID in case the command is not registered
          try {
            let commandId = await interaction.client.application.commands
              .fetch()
              .then((commands) => commands.find((cmd) => cmd.name === name).id)

            // Make sure to update command categories
            if (folder === 'info') {
              infoField.push(`</${name}:${commandId}>`)
            }
            if (folder === 'fun') {
              funField.push(`</${name}:${commandId}>`)
            }
            if (folder === 'economy') {
              economyField.push(`</${name}:${commandId}>`)
            }
            if (folder === 'moderation') {
              moderationField.push(`</${name}:${commandId}>`)
            }
            if (folder === 'image') {
              imageField.push(`</${name}:${commandId}>`)
            }
            if (folder === 'music') {
              musicField.push(`</${name}:${commandId}>`)
            }
            if (folder === 'star') {
              starField.push(`</${name}:${commandId}>`)
            }
          } catch (error) {
            console.error(`Error fetching ID for ${name}: ${error.message}`)
          }
        }
      }

      const cmdListEmbed = new EmbedBuilder()
        .setColor(colors.invis)
        .setTitle('Command List')
        .setDescription(`\`/help [category] - View specific category\``)
        .setAuthor({
          name: 'Sparky Bot HelpDesk',
          iconURL: interaction.client.user.avatarURL(),
        })
        // Make sure to update command categories
        .addFields([
          { name: `${emotes.info} Info`, value: `${infoField.join(', ')}` },
          { name: `${emotes.fun} Fun`, value: `${funField.join(', ')}` },
          {
            name: `${emotes.economy} Economy`,
            value: `${economyField.join(', ')}`,
          },
          {
            name: `${emotes.moderation} Moderation`,
            value: `${moderationField.join(', ')}`,
          },
          {
            name: `${emotes.imageGeneration} Image Generation`,
            value: `${imageField.join(', ')}`,
          },
          { name: `${emotes.music} Music`, value: `${musicField.join(', ')}` },
          { name: `${emotes.star} Star`, value: `${starField.join(', ')}` },
        ])

      if (category === 'None') {
        const mainMenuEmbed = new EmbedBuilder()
          .setColor(colors.invis)
          .setDescription('`/help [category] - View specific category`')
          .setAuthor({
            name: 'Sparky Bot HelpDesk',
            iconURL: interaction.client.user.avatarURL(),
          })
          .addFields([
            {
              name: `${emotes.category} Categories`,
              value: `${fs
                .readdirSync('./src/commands')
                .map(getCategoryNameForMainMenu)
                .join('\n')}`,
            },
            {
              name: `${emotes.link} Links`,
              value: `> [Support Server](https://discord.gg/TNE72AtH7y) | [GitHub Repository](https://github.com/aidh-aadil/sparky-bot)`,
            },
          ])
        const cmdListButton = new ButtonBuilder()
          .setLabel('Command List')
          .setStyle(ButtonStyle.Secondary)
          .setCustomId('cmdList')
          .setEmoji('<:S_cmdlist:1208690790096699422>"')

        const mainMenuBtn = new ButtonBuilder()
          .setLabel('Home')
          .setStyle(ButtonStyle.Secondary)
          .setCustomId('home')
          .setEmoji('<:S_home:1208707747361857536>')

        const rowWithCmdBtn = new ActionRowBuilder().addComponents(
          cmdListButton
        )
        const rowWithHomeBtn = new ActionRowBuilder().addComponents(mainMenuBtn)
        const reply = await interaction.editReply({
          embeds: [mainMenuEmbed],
          components: [rowWithCmdBtn],
        })

        const collector = reply.createMessageComponentCollector({
          time: 60_000 * 5,
        })
        collector.on('collect', async (i) => {
          if (i.user.id === interaction.user.id) {
            if (i.customId === 'cmdList') {
              await i.update({
                embeds: [cmdListEmbed],
                components: [rowWithHomeBtn],
              })
            }
            if (i.customId === 'home') {
              await i.update({
                embeds: [mainMenuEmbed],
                components: [rowWithCmdBtn],
              })
            }
          } else {
            await i.reply({
              content: 'You should run the command to use this interaction',
              ephemeral: true,
            })
          }
        })
        collector.on('end', async (collected, reason) => {
          if (reason === 'time') {
            await reply.edit({ components: [] })
          }
        })
        return
      }

      let embedDescription = []

      const commandFiles = fs
        .readdirSync(`./src/commands/${category}`)
        .filter((file) => file.endsWith('.js'))

      for (const file of commandFiles) {
        const command = require(`./../${category}/${file}`)
        let name = `${command.data.name}`
        let description = `${command.data.description}`

        // Handle errors when fetching the command ID in case the command is not registered
        try {
          let commandId = await interaction.client.application.commands
            .fetch()
            .then((commands) => commands.find((cmd) => cmd.name === name).id)

          embedDescription.push(`</${name}:${commandId}> \n> ${description}`)
        } catch (error) {
          console.error(`Error fetching ID for ${name}: ${error.message}`)
        }
      }

      const categoryEmbed = new EmbedBuilder()
        .setColor(colors.invis)
        .setThumbnail(getCategoryImage(category))
        .setTitle(`${getCategoryTitle(category)}`)
        .setDescription(`${embedDescription.join('\n\n')}`)

      if (fs.readdirSync('./src/commands').includes(category)) {
        return await interaction.editReply({ embeds: [categoryEmbed] })
      }
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
