const { Util } = require("discord.js")
const { fn, ids } = require("../../config")
const { botban } = require("../../db")

module.exports = {
  command: {
    name: "botban",
    description: "Ban a user from the bot.",
    adminGuild: true,
    options: [
      {
        type: "USER",
        name: "user",
        description: "User you would like to ban",
        required: true,
      },
      {
        type: "STRING",
        name: "reason",
        description: "Reason for this ban.",
        required: false,
      },
      {
        type: "STRING",
        name: "type",
        description: "Whether to ban or unban (defaults to ban)",
        required: false,
        choices: [
          { name: "Ban", value: "ban" },
          { name: "Unban", value: "unban" },
        ],
      },
    ],
  },
  run: async (interaction, client) => {
    if(!interaction.dbUser.flags.includes("STAFF")) return interaction.reply({content: "You do not have permission to use this command.", ephemeral: true})
    let reason = interaction.options.get("reason")?.value
    let userData = interaction.options.get("user").user
    let type = interaction.options.getString("type") || "ban"
    console.log(userData)

    let check = await fn.banCheck(userData.id)
    switch (type) {
      case "ban":
        if (check) return interaction.reply(`${userData.username}#${userData.discriminator} has already been banned by <@${check.mod}>. Reason: \`\`\`${check.reason}\`\`\``, { allowedMentions: {} })
        let done = await new botban({ user: userData.id, reason: reason, mod: interaction.member.id })
        done.save()
        return interaction.reply(`Botban complete!\n\`\`\`js\n${done}\`\`\``)
        break
      case "unban":
        if (!check) return interaction.reply(`${userData.username}#${userData.discriminator} has not been banned.`)
        let undone = await botban.deleteOne({ user: userData.id })
        return interaction.reply(`Unbotban complete!\n\`\`\`js\n${JSON.stringify(undone, null, 2)}\`\`\``)
        break
    }
  },
}
