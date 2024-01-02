const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: {
    name: "kick",
    description: "Kick an user",
    options: [
      {
        name: "user",
        description: "Select the user to kick",
        type: ApplicationCommandOptionType.Mentionable,
        required: true,
      },
      {
        name: "reason",
        description: "Reason for kicking",
        type: ApplicationCommandOptionType.String,
        required: false,
      },
    ],

    permissionsRequired: [PermissionFlagsBits.ModerateMembers],
    botPermissions: [PermissionFlagsBits.ModerateMembers],
  },

  async execute(interaction) {
    try {
      const targetUserID = interaction.options.get("user")?.value;
      const reason =
        interaction.options.get("reason")?.value || "No reason provided.";

      const targetUser = await interaction.guild.members.fetch(targetUserID);

      await interaction.deferReply();

      if (!targetUser) {
        await interaction.editReply(
          `Looks like that user isn't in this server`
        );
        return;
      }

      if (targetUser.id == interaction.member.id) {
        await interaction.editReply(`You cannot kick yourself. Bozo!`);
        return;
      }

      if (targetUser.id === interaction.guild.ownerId) {
        await interaction.editReply(
          `You are not allowed to kick that user. They are the server owner`
        );
        return;
      }

      const targetUserRolePosition = targetUser.roles.highest.position;
      const requestUserRolePosition = interaction.member.roles.highest.position;
      const botRolePosition = interaction.guild.members.me.roles.highest.position;

      if (targetUserRolePosition >= requestUserRolePosition) {
        await interaction.editReply(
          "You cannot kick someone higher than or equal to you."
        );
        return;
      }

      if (targetUserRolePosition >= botRolePosition) {
        await interaction.editReply(
          "I cannot kick someone higher than or equal to me."
        );
        return;
      }

      await targetUser.kick({ reason });

      const embed = new EmbedBuilder()
        .setColor(0x9b59b6)
        .setDescription(
          `\nReason: ${reason}\nModerator: <@${interaction.member.id}>\nServer: ${interaction.guild.name}`
        )
        .setTimestamp();

      await interaction.editReply({
        content: `**${targetUser} has been kicked!**`,
        embeds: [embed],
      });
    } catch (error) {
      console.log(error);
    }
  },
};
