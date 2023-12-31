const { EmbedBuilder } = require("@discordjs/builders");
const { version, Client, Interaction } = require("discord.js");

module.exports = {
  name: 'ping',
  description: 'View bot latency',

  /**
   * 
   * @param {Client} client 
   * @param {Interaction} interaction 
   */

  callback: async (client, interaction) => {
    try {
      await interaction.deferReply();
      
      const reply = await interaction.fetchReply();

      const ping = reply.createdTimestamp - interaction.createdTimestamp;
      const uptime = formatUptime(client.uptime)

      const description = `\`\`\`fix\nPing:   ${ping} ms\nWS:     ${client.ws.ping} ms\nUptime: ${uptime}\nNode:   ${process.version}\nDJS:    v${version}\`\`\``;

      const embed = new EmbedBuilder()
        .setDescription(description)
        .setColor(0x9b59b6)

     await interaction.editReply({
       embeds: [embed]
      });

    } catch (error) {
      await interaction.editReply('Oops! There was an error.')
      console.log(error)
    }
  },
};

function formatUptime(uptimeMilliseconds) {
  const seconds = Math.floor(uptimeMilliseconds / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor(((seconds % 86400) % 3600) / 60);
  const secondsLeft = ((seconds % 86400) % 3600) % 60;

  return `${days}d ${hours}h ${minutes}m ${secondsLeft}s`;
}