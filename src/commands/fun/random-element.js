const { EmbedBuilder, SlashCommandBuilder } = require('@discordjs/builders')
const { colors } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('random-element')
    .setDMPermission(false)
    .setDescription('Get a random element from the periodic table'),

  async execute(interaction) {
    try {
      await interaction.deferReply()

      const url = await fetch(`https://api.popcat.xyz/periodic-table/random`)

      let info = await url.json()

      if (info['error']) {
        await interaction.editReply(info['error']).then((msg) => {
          setTimeout(() => {
            msg.delete()
          }, 10000)
        })
        return
      }

      let name = info['name']
      let image = info['image']
      let phase = info['phase']
      let period = info['period']
      let atomicNumber = info['atomic_number']
      let atomicMass = info['atomic_mass']
      let symbol = info['symbol']
      let discoveredBy = info['discovered_by']
      let summary = info['summary']

      const description = `\`\`\`fix\nAtomic Number: ${atomicNumber}\nAtomic Mass:   ${atomicMass}\nPeriod:        ${period}\nPhase:         ${phase}\`\`\``

      const embed = new EmbedBuilder()
        .setTitle(`${name} (${symbol})`)
        .setColor(colors.yellow)
        .setThumbnail(image)
        .setDescription(`${summary}\n${description}`)
        .setFooter({
          text: `Discovered by ${discoveredBy}`,
        })

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
