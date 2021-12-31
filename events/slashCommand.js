const Discord = require("discord.js")
const { users, guilds } = require("../db")

const { Collection, Util } = require("discord.js")
const { fn } = require("../config")

module.exports = (client) => {
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return

    let check = await fn.banCheck(interaction.user.id)
    if (check)
      return interaction.reply({
        content: "You are banned from this bot! Reason: " + check.reason,
        ephemeral: true,
      })

    if (process.env.MAINTENANCE) return interaction.reply({ content: "The bot is currently in maintenance mode. Please try again later.", ephemeral: true })

    interaction.dbUser = await users.findOne({ user: interaction.user.id }).exec()
    if (!interaction.dbUser) interaction.dbUser = await new users({ user: interaction.user.id }).save()

    let commandFile = client.commands.get(interaction.commandName)

    if (!commandFile) return interaction.reply("Command not found")

    await commandFile.run(interaction, client).catch(async (error) => {
      console.error(error)
      interaction.reply("An error has occurred!")
    })
  })
}
