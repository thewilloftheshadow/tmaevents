const { MessageSelectMenu, MessageActionRow } = require("discord.js")
const { gameModes } = require("../../config")
const db = require("quick.db")
const ms = require("ms")

const { ids } = require("../../config")

module.exports = {
  command: {
    name: "transfer",
    description: "Transfer your coins from The Casino back to TMA",
    defaultPermission: true,
  },
  run: async (interaction, client) => {
    await interaction.deferReply()
    
    let bal = await client.unb.getUserBalance(ids.casino, interaction.user.id)
    await client.unb.editUserBalance(interaction.guild.id, interaction.user.id, { cash: bal.total });

    await client.unb.editUserBalance(ids.casino, interaction.user.id, { cash: 0 - bal.total }); 
    
    interaction.editReply({content: `**Transfer success!**\n>>> Coins added: <a:coin:567068728714330113> ${bal.total}`})

  },
}
