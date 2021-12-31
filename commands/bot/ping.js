module.exports = {
  command: {
    name: "ping",
    description: "Replies with bot ping.",
    defaultPermission: true,
  },
  permissions: [],
  run: async (interaction, client) => {
    interaction.reply(`Pong! ${Math.ceil(interaction.client.ws.ping)}ms`)
  },
}
