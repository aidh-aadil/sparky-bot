const { EmbedBuilder } = require('@discordjs/builders')
const { ApplicationCommandOptionType, Client, Interaction, Embed } = require('discord.js')

module.exports = {
    name: 'banner',
    description: 'Display user banner',

    options: [
        {
            name: 'user',
            description: 'Select the user',
            type: ApplicationCommandOptionType.Mentionable
        }
    ],

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async(client, interaction) => {
        try {
            
            await interaction.deferReply()

            const targetUserID = interaction.options.get('user')?.value || interaction.member.id
            const targetUser = await interaction.guild.members.fetch(targetUserID)

            function getDescription() {
                if (targetUser.user.bannerURL()) {
                    return `[WEBP](${targetUser.user.bannerURL({size: 4096})}) | [JPG](${targetUser.user.bannerURL({size: 4096, extension: 'jpg'})}) | [PNG](${targetUser.user.bannerURL({size: 4096, extension: 'png'})})`
                } else {
                    return `\`This user doesn't have a banner\``
                }
            }

            const embed = new EmbedBuilder()
                .setColor(0x9b59b6)
                .setTitle(`${targetUser.user.username}'s banner`)
                .setDescription(getDescription())
                .setImage(targetUser.user.bannerURL({size: 4096}))

            await interaction.editReply({
                embeds: [embed]
            })

        } catch (error) {
            console.log(error)
            await interaction.editReply('Oops! There was an error')
        }
    }
}