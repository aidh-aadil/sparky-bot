const { EmbedBuilder } = require("@discordjs/builders");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  data: {
    name: "user-info",
    description: "View some information about user",

    options: [
      {
        name: "user",
        description: "Select the user",
        type: ApplicationCommandOptionType.Mentionable,
      },
    ],
  },

  async execute(interaction) {
    try {
      await interaction.deferReply();

      const targetUserID =
        interaction.options.get("user")?.value || interaction.member.id;
      const targetUser = await interaction.guild.members.fetch(targetUserID);

      const embed = new EmbedBuilder()
        .setTitle(`${targetUser.user.username}`)
        .setColor(0x9b59b6)
        .setThumbnail(targetUser.user.avatarURL())
        .addFields(
          { name: "Username", value: `${targetUser.user.tag}`, inline: true },
          { name: "User ID", value: `${targetUserID}`, inline: true },
          { name: "Joined on", value: `${targetUser.joinedAt.toUTCString()}` },
          {
            name: "Created on",
            value: `${targetUser.user.createdAt.toUTCString()}`,
            inline: true,
          }
        );

      await interaction.editReply({
        embeds: [embed],
      });
    } catch (error) {
      console.log(error);
    }
  },
};
