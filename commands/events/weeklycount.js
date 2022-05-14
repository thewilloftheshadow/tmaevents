const { ids } = require("../../config")

module.exports = {
  command: {
    name: "weeklycount",
    description: "Count the number of users on each weekly stage",
    defaultPermission: true,
  },
  permissions: [],
  run: async (interaction, client) => {
    if(interaction.guild.id != ids.tma) return interaction.reply({content: "This command can only be used in the main TMA server!", ephemeral: true})

    await interaction.deferReply()
    
    let wr = ids.weekly

    let message = "**__Weekly Stats__**\n>>> "

    await Promise.all(
        wr.map(async id => {
            let role = interaction.guild.roles.resolve(id)
            message += `<@&${id}>: ${role?.members?.size || 0} players\n`
        })
    )

    interaction.editReply({content: message, allowedMentions: {roles: []}})
  },
}
