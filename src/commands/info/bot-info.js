const { EmbedBuilder } = require("@discordjs/builders");
const { botVersion, status, totalCommands } = require('../../../config.json')
const { version, Client, Interaction } = require('discord.js')
const { execSync } = require('child_process');

module.exports = {
  name: 'bot-info',
  description: 'View some information about the bot',

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
      const lastUpdatedDate = getLastCommitDate();
      const totalMembers = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0);

      const description = `\`\`\`fix\nDeveloper:   aidhaadil\nStatus:      ${status}\nLanguage:    JavaScript\nCreated on:  ${client.user.createdAt.toUTCString()}\nLast update: ${lastUpdatedDate}\`\`\``;
      
      const pingField = `\`\`\`fix\nPing:   ${ping} ms\nWS:     ${client.ws.ping} ms\nUptime: ${uptime}\nNode:   ${process.version}\nDJS:    v${version}\`\`\``;
      const statsField = `\`\`\`fix\nBot ID: ${client.user.id}\nBot Version: v${botVersion}\nServers: ${client.guilds.cache.size}\nUsers: ${totalMembers}\nCommands: ${totalCommands}\`\`\``;

      const embed = new EmbedBuilder()
        .setTitle('Bot Info')
        .setColor(0x9b59b6)
        .setDescription(description)
        .addFields(
            {name: 'Ping',  value: pingField, inline: true},
            {name: 'Stats', value: statsField, inline: true}
        )
        
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


function getLastCommitDate() {
  const command = `git log -1 --format=%cd --date=format:"%d.%m.%Y" --all`;
  const lastCommitDate = execSync(command, { encoding: 'utf-8' });
  return lastCommitDate.trim();
}
  
  