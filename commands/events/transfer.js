const { MessageSelectMenu, MessageActionRow } = require("discord.js")
const { gameModes } = require("../../config")
const db = require("quick.db")
const ms = require("ms")

const { ids } = require("../../config")

module.exports = {
  command: {
    name: "transfer",
    description: "Transfer your coins from TMA to The Casino, for a small fee",
    defaultPermission: true,
    options: [
      {
        type: "INTEGER",
        name: "amount",
        description: "The amount you would like to transfer",
        required: true,
      },
    ],
  },
  run: async (interaction, client) => {
    interaction.deferReply()
    let cd = db.get("lastRan.transfer." + interaction.user.id)
    if(cd + ms("10m") > Date.now()) return interaction.reply({content: `You are on a cooldown! Try again in <t:${Math.floor(new Date(cd + ms("10m")) / 1000)}:R>`})
    
    let amount = interaction.options.get("amount").value
    if(!amount) return interaction.reply({content: "You must specify an amount to transfer"})
    let bal = await client.unb.getUserBalance(ids.tma, interaction.user.id)

    if(bal.total < amount) return interaction.editReply(`Sorry, you only have <a:coin:567068728714330113> ${bal.total}, so you can't transfer <a:coin:567068728714330113> ${amount}`)

    await client.unb.editUserBalance(ids.tma, interaction.user.id, { cash: 0 - amount });

    let fee = Math.floor(amount * feeCalc(amount))

    let tokens = amount - fee

    await client.unb.editUserBalance(interaction.guild.id, interaction.user.id, { cash: tokens }); 
    db.set(`lastRan.transfer.${interaction.user.id}`, Date.now())
    interaction.editReply({content: `**Transfer success!**\n>>> Coins removed: <a:coin:567068728714330113> ${amount}\nTokens added: <:token:937722644369932368> ${tokens}\n\nFee: <a:coin:567068728714330113> ${fee}`})

  },
}


let feeCalc = (amount) => {
  if(amount > 50000) return 0.25
  if(amount > 30000) return 0.20
  if(amount > 10000) return 0.15
  if(amount > 5000) return 0.10
  if(amount > 1000) return 0.05
  return 0
}