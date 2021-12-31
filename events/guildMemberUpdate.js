const { MessageSelectMenu, MessageActionRow } = require("discord.js")
const db = require("quick.db")

module.exports = (client) => {
  client.on("guildMemberUpdate", async (oldMember, newMember) => {
    if (oldMember.roles.cache != newMember.roles.cache) client.emit("stafflist")
  })
}
