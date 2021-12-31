const { MessageEmbed, MessageActionRow } = require("discord.js")
const ms = require("ms")

module.exports = {}


module.exports.disableButtons = (message) => {
  let row = new MessageActionRow()
  let btns = message.components[0].components
  btns.forEach((x) => {
    x.setDisabled(true)
    row.addComponents(x)
  })

  let sendData = {}
  if (message.content) sendData.content = message.content
  if (message.embeds) sendData.embeds = message.embeds
  if (message.components) sendData.components = message.components
  return sendData
}
