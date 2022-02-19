const ms = require("ms")
const db = require("quick.db")


const numbers = ["O64", "B15", "I21", "B11", "B14", "I16", "O61", "O74", "O67", "G55", "N38", "N34", "B10", "O62", "I26", "I29", "N32", "B6", "G49", "B5", "N36", "I27", "I24", "G52", "G51", "N40", "O72", "O68", "G47", "O69 (nice)", "B13", "B2", "I23", "G57", "B7", "G54", "I17", "B4", "O71", "O65", "O75", "N44", "G53", "G56", "B3", "O70", "B1", "G48", "O73", "G46", "I30", "N41", "N43", "G59", "B8", "G50", "N42", "I18", "I22", "I25", "N35", "I19", "N33", "O63", "G58", "N39", "I20", "N45", "N31", "N37", "B12", "B9", "O66", "I28", "G60"]
const bingoChan = "943565929831342141"


module.exports = (client) => {
    
  
    const bingo = async () => {
      let round = db.get("bingo.round") 
      if(!round) round = 0

      let num = numbers[round]

      if(!num) return

      let c = await client.guilds.cache.get("937721646024896624").channels.fetch(bingoChan)

      c.send(`<@&944119489044283442> the next number is ${num}. The prize has increased to <:token:937722644369932368> ${(round + 1) * (350)}`)

      db.add("bingo.round", 1)

    }
  
    setInterval(bingo, ms("20m"))
    
    bingo()
  }