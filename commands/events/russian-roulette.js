const wait = require("util").promisify(setTimeout)
const token = `<:token:937722644369932368>`
const botData = require("quick.db")
const arrayPull = require("array-pull")
const { MessageEmbed } = require("discord.js")
const ms = require("ms")

module.exports = {
  command: {
    name: "russian-roulette",
    description: "Play a game of Russian Roulette",
    defaultPermission: true,
    options: [
      {
        type: "INTEGER",
        name: "amount",
        description: "If you are trying to start a game, specify the bet amount here.",
        required: false,
      },
    ],
  },
  run: async (interaction, client) => {
    await interaction.deferReply()
    let cd = botData.get("lastRan.russian." + interaction.user.id)
    if (cd + ms("3m") > Date.now()) return interaction.editReply({ content: `You are on a cooldown! Try again in <t:${Math.floor(new Date(cd + ms("3m")) / 1000)}:R>` })

    if (!botData.get("russian")) botData.set("russian", {})
    const data = botData.get(`russian.${interaction.channel.id}`)

    if (data) {
      if (data.active) return interaction.editReply("This game has already started.")
      else if (data.participants.length === 12) return interaction.editReply("The table is currently full!")
      else if (data.participants.includes(interaction.user.id)) return interaction.editReply("You already joined this game!")
      const { bet } = data
      //Check if user has bet
      let bal = await client.unb.getUserBalance(interaction.guild.id, interaction.user.id)

      if (bet > bal.cash) return interaction.editReply(`You do not have enough in your wallet for this bet. The bet for this round is ${token} ${bet.toLocaleString()}`)

      await client.unb.editUserBalance(interaction.guild.id, interaction.user.id, { cash: 0 - bet })

      botData.push(`russian.${interaction.channel.id}.participants`, interaction.user.id)

      return interaction.editReply(`You have successfully joined the game!`)
    }

    if (!interaction.options.get("amount")?.value) return interaction.editReply("You must provide an amount to start a Russian Roulette match.")
    const bet = Math.floor(parseInt(interaction.options.get("amount")?.value))

    if (50 > bet && bet !== 0) return interaction.editReply("The minimum bet in The Casino is 50.")

    let bal = await client.unb.getUserBalance(interaction.guild.id, interaction.user.id)

    if (bet > bal.cash) return interaction.editReply(`You do not have enough in your wallet for this bet. The bet for this round is ${token} ${bet.toLocaleString()}`)

    await client.unb.editUserBalance(interaction.guild.id, interaction.user.id, { cash: 0 - bet })

    botData.set(`russian.${interaction.channel.id}`, { bet, participants: [interaction.user.id], active: false })

    await interaction.editReply(`<a:s_siren:886258804881244242> **ALERT** <a:s_siren:886258804881244242>!\n${interaction.user} is gathering players for a game of Russian Roulette!\nTo enter, type \`/russian-roulette\` to enter. It costs ${token} ${bet.toLocaleString()} and will start in 90 seconds.`)
    interaction.channel.send({ content: "@here", allowedMentions: { parse: { everyone: true } } })

    await wait(90000)
    botData.set(`russian.${interaction.channel.id}.active`, true)

    // All of the data needed for the game
    const newData = botData.get(`russian.${interaction.channel.id}`)

    if (newData.participants.length === 1) {
      botData.delete(`russian.${interaction.channel.id}`)

      await client.unb.editUserBalance(interaction.guild.id, interaction.user.id, { cash: bet })
      return interaction.channel.send("You can't play by yourself! Game ended and member refunded.")
    }
    const winningAmount = newData.bet * newData.participants.length
    interaction.channel.send(`Doors have now closed! For ${token} ${winningAmount.toLocaleString()}, welcome to Russian Roulette!`)

    await wait(5000)

    const chamber = newData.participants.length < 6 ? 6 : 12
    let round = 1
    let activeGame = true
    let winner
    botData.set(`russian.${interaction.channel.id}.originalParticipants`, newData.participants)

    while (activeGame) {
      let chamberPosition = 0
      const bulletPosition = Math.floor(Math.random() * chamber)
      console.log(bulletPosition)
      let participants = botData.get(`russian.${interaction.channel.id}.participants`)
      let og = botData.get(`russian.${interaction.channel.id}.originalParticipants`)
      interaction.channel.send(`**Round #${round}**`)
      let embed = new MessageEmbed()
        .setTitle(`**Round #${round}**`)
        .setDescription(participants.map((x) => (og.includes(x) ? `☠️ <@${x}>` : `<@${x}>`)).join("\n"))
        .setColor("RANDOM")
      let activeRound = true
      let turn = 0
      await wait(7000)

      while (activeRound) {
        const id = participants[turn]
        const user = client.users.resolve(id)
        interaction.channel.send(`${user.tag} points the gun at their head and slowly pulls the trigger...`)
        await wait(4000)
        if (chamberPosition !== bulletPosition) {
          interaction.channel.send(`**CLICK!** Relieved, ${user.tag} passes the gun along.`)
          chamberPosition++
          turn++
          if (!participants[turn]) turn = 0
          await wait(2000)
          continue
        } else {
          participants = arrayPull(participants, id)
          botData.set(`russian.${interaction.channel.id}.participants`, participants)
          interaction.channel.send(`**BANG!** ${user} is now dead.`)
          await wait(2000)
          if (participants.length === 1) {
            winner = client.users.resolve(participants[0])
            activeGame = false
          }
          round++
          break
        }
      }
    }

    await client.unb.editUserBalance(interaction.guild.id, winner.id, { cash: winningAmount })
    botData.delete(`russian.${interaction.channel.id}`)
    return interaction.channel.send(`Congratulations, ${winner}! You survived Russian Roulette and won ${token} ${winningAmount.toLocaleString()}`)
  },
}
