module.exports = (client) => {
    client.on("messageCreate", (message) => {
      if (message.author.id != "204255221017214977") return
  
      console.log(message.content)
  
      let data = message.content.replace(/\`/g, "").split("\n")[0].split(" ")
  
      console.log(data)
  
      if ((data[0] = "!add-coins")) {
        client.unb.editUserBalance(message.guild.id, data[1], { cash: data[2] })
        message.reply("Coins have been added")
      }
    })
  }
  
