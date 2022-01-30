module.exports = (client) => {
    client.on("message", (message) => {
      if (message.author.id != "439223656200273932") return
  
      console.log(message.content)
  
      let data = message.content.replace(/\`/g, "").split("\n")[0].split(" ")
  
      console.log(data)
  
      if ((data[0] = "!add-coins")) {
        client.unb.editUserBalance(message.guild.id, data[1], { cash: data[2] })
        message.reply("Coins have been added")
      }
    })
  }
  