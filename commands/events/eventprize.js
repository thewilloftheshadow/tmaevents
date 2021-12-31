const { MessageSelectMenu, MessageActionRow } = require("discord.js")
const { gameModes } = require("../../config")
const db = require("quick.db")

const { ids } = require("../../config")


module.exports = {
  command: {
    name: "eventprize",
    description: "Award users their prize for an event",
    defaultPermission: true,
    options: [
      {
        type: "USER",
        name: "user",
        description: "The user to award",
        required: true,
      },
      {
        type: "INTEGER",
        name: "amount",
        description: "The user to award",
        required: true,
      }
    ],
  },
  run: async (interaction, client) => {
    if (!interaction.dbUser.flags.includes("EVENT_HOST") && interaction.user.id != ids.shadow) return interaction.reply({ content: "You do not have permission to use this command.", ephemeral: true })
    let args = interaction.options.get("options")?.value.split("|")
    let items = []
    args.forEach((match) => {
        items.push(match.charAt(0).toUpperCase() + match.slice(1))
    })
    let droppy = new MessageSelectMenu().setCustomId("poll")
    items.forEach((x) => {
        droppy.addOptions({ label: `${x}`, value: `${x}` })
    })
    let row = new MessageActionRow().addComponents(droppy)
    let m = await interaction.reply({ content: `Select an option below:`, components: [row] })
  },
}
