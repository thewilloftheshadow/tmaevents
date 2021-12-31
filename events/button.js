const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js")
const { users } = require("../db")
const shuffle = require("shuffle-array")
const { disableButtons } = require("../fn")

const teams = {
  blaze: "879323910926110760",
  terra: "880767061146628128",
  aqua: "880766936881983508",
  Wizard: "894902085487820870",
  wizard: "894902085487820870",
  Scientist: "894902103129092096",
  scientist: "894902103129092096",
  Assassin: "894902064424050739",
  assassin: "894902064424050739",
  Staff: "569462688632143872",
  staff: "569462688632143872"
}

/*

Custom IDs are parsed in this way:

command-arg1,arg2,arg3,...arg99





*/
module.exports = (client) => {
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return

    if (process.env.MAINTENANCE) return interaction.reply({ content: "The bot is currently in maintenance mode. Please try again later.", ephemeral: true })
    let data = interaction.customId.split("-")
    let cmd = data[0]
    let args = data[1] || ""
    if (args) args = args.split(",")
    console.log(cmd, args)

    interaction.dbUser = await users.findOne({ user: interaction.user.id }).exec()
    if (!interaction.dbUser) interaction.dbUser = await new users({ user: interaction.user.id }).save()

    if (cmd == "disableAll") {
      let x = disableButtons(interaction.message)
      interaction.message.edit(x)
      interaction.deferUpdate()
    }

    if (cmd == "ability") {
      let team = args[0]
      if (!interaction.member.roles.cache.has(teams[team])) return interaction.reply({ content: `You are not in the ${team} class!`, ephemeral: true })
      let winner = ""
      let roles = interaction.member.roles.cache
      if (roles.has(teams.blaze)) winner = "Blaze"
      else if (roles.has(teams.aqua)) winner = "Aqua"
      else if (roles.has(teams.terra)) winner = "Terra"
      else return interaction.reply({content: "You are not in a team!", ephemeral: true})
      let x = disableButtons(interaction.message)
      interaction.message.edit(x)

      interaction.reply(`The ${winner} team has activated the ability!`)
    }
  })
}
