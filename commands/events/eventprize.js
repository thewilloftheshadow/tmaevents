const { MessageSelectMenu, MessageActionRow, MessageButton } = require("discord.js")
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
      },
      {
        type: "STRING",
        name: "message",
        description: "The message to DM the user",
        required: false
      }
    ],
  },
  run: async (interaction, client) => {
    if (!interaction.dbUser.flags.includes("EVENT_HOST") && interaction.user.id != ids.shadow) return interaction.reply({ content: "You do not have permission to use this command.", ephemeral: true })
    let user = interaction.options.get("user").value
    let amount = interaction.options.get("amount").value
    let message = interaction.options.get("message")?.value

    if (user.bot) return interaction.reply({ content: "You cannot award a bot a prize.", ephemeral: true })

    // check if the bot has permissions in unbapi
    const perm = await client.unb.getApplicationPermission(interaction.guild.id)
    if(!perm.has("economy")) return interaction.reply({content: `Sorry, I don't have the required permissions to interact with the Unbelievaboat API. You can grant me access at the link below.`, components: [new MessageActionRow().addComponents(new MessageButton().setURL(`https://unbelievaboat.com/applications/authorize?app_id=${client.user.id}&guild_id=${interaction.guild.id}`).setLabel("Authorize").setStyle("LINK"))]})

    const guildSet = client.unb.getGuild(interaction.guild.id)

    await client.unb.editUserBalance(interaction.guild.id, user, { bank: amount })

    interaction.reply(`Successfully awarded ${amount} to <@${user}>`)

    if(message) {
      await client.users.resolve(user).send(message).catch(() => interaction.channel.send("I was unable to DM the user"))
    }

  },
}
