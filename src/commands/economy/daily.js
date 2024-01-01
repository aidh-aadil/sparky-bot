const { EmbedBuilder } = require("@discordjs/builders");
const { version, Client, Interaction } = require("discord.js");
const UserProfile = require('../../../schemas/userProfile')

const dailyAmount = 100

module.exports = {
  name: 'daily',
  description: 'Claim your daily rewards',
  testOnly: false,

  /**
   * 
   * @param {Client} client 
   * @param {Interaction} interaction 
   */

  callback: async (client, interaction) => {

    if (!interaction.inGuild()) {
        await interaction.reply({
            content: 'This command can only be ran in a server',
            ephemeral: true
        })
        return
    }

    try {
        await interaction.deferReply()

        const dailyAlreadyCollectedEmbed = new EmbedBuilder()
            .setColor(0x9b59b6)
            .setDescription('You have already collected your daily rewards for today!')
            .setFooter({
                text: `Next daily in ${countdownToNextDay()}`
            })

        let userProfile = await UserProfile.findOne({
            userID: interaction.member.id,
            guildID: interaction.guild.id
        })

        if (userProfile) {
            const lastDailyDate = userProfile.lastDailyCollected?.toDateString()
            const currentDate = new Date().toDateString()

            if (lastDailyDate === currentDate) {
                interaction.editReply({
                    embeds: [dailyAlreadyCollectedEmbed]
                })
                return 
            }
        } else {
            userProfile = new UserProfile({
                userID: interaction.member.id,
                guildID: interaction.guild.id
            })
        }

        userProfile.balance += dailyAmount
        userProfile.lastDailyCollected = new Date()
        await userProfile.save()

        const dailyCollectedEmbed = new EmbedBuilder()
            .setColor(0x9b59b6)
            .setTitle('Collected your daily rewards!')
            .setDescription(`You received :moneybag: ${dailyAmount}.\nCurrent balance is :moneybag: ${userProfile.balance}`)
            .setFooter({
                text: `Next daily in ${countdownToNextDay()}`
            })

        await interaction.editReply({
            embeds: [dailyCollectedEmbed]
        })
        
    } catch (error) {
        console.log(error)
        await interaction.editReply('Oops! There was an error')
    }
  }
};

function countdownToNextDay() {
    const now = new Date();
    const millisecondsInADay = 24 * 60 * 60 * 1000; 
    const nextDay = new Date(now.getTime() + millisecondsInADay); 
    nextDay.setHours(0, 0, 0, 0); 
    const timeRemaining = nextDay - now;
  
    const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const secondsRemaining = Math.floor((timeRemaining % (1000 * 60)) / 1000);
  
    return `${hoursRemaining}h ${minutesRemaining}m ${secondsRemaining}s`
}