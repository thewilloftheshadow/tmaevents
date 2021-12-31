const db = require("quick.db")

const { ids } = require("../config")

module.exports = (client) => {
  client.on("stafflist", async () => {
    console.log("Generating staff list")
    let tma = client.guilds.cache.get(ids.tma)
    let chanId = db.get("stafflistChannel")
    let chan = tma.channels.cache.get(ids.stafflist),
      mid = db.get("stafflist"),
      mid2 = db.get("stafflist2")
    if (!chan || !chanId) return
    let msg = await chan.messages.fetch(mid).catch(() => {})
    let msg2 = await chan.messages.fetch(mid2).catch(() => {})

    if (!msg || !mid) {
      msg = await chan.send("Generating staff list...")
      msg2 = await chan.send("...")
      db.set("stafflist", msg.id)
      db.set("stafflist2", msg2.id)
    }
    console.log("Message: " + mid)
    console.log("Message 2: " + mid2)
    let m2 = ""
    let m = `**Manager**\n> ${tma.members.cache
      .filter((x) => x.roles.cache.has(ids.manager))
      .map((x) => `<@${x.id}> - ${x.user.tag}`)
      .join("\n> ")}\n`
    m += `**Admin**\n> ${tma.members.cache
      .filter((x) => x.roles.cache.has(ids.admin) && !x.roles.cache.has(ids.manager))
      .map((x) => `<@${x.id}> - ${x.user.tag}`)
      .join("\n> ")}\n`
    m += `**Head Moderator**\n> ${tma.members.cache
      .filter((x) => x.roles.cache.has(ids.headMod) && !x.roles.cache.has(ids.admin))
      .map((x) => `<@${x.id}> - ${x.user.tag}`)
      .join("\n> ")}\n`
    m += `**Senior Moderator**\n> ${tma.members.cache
      .filter((x) => x.roles.cache.has(ids.srMod) && !x.roles.cache.has(ids.headMod) && !x.roles.cache.has(ids.admin))
      .map((x) => `<@${x.id}> - ${x.user.tag}`)
      .join("\n> ")}\n`
    m += `**Moderator**\n> ${tma.members.cache
      .filter((x) => x.roles.cache.has(ids.mod) && !x.roles.cache.has(ids.headMod) && !x.roles.cache.has(ids.admin) && !x.roles.cache.has(ids.srMod))
      .map((x) => `<@${x.id}> - ${x.user.tag}`)
      .join("\n> ")}\n`
    m += `**Helper**\n> ${tma.members.cache
      .filter((x) => x.roles.cache.has(ids.helper) && !x.roles.cache.has(ids.mod))
      .map((x) => `<@${x.id}> - ${x.user.tag}`)
      .join("\n> ")}\n`

    m2 += `\n**Head of Events**\n> ${tma.members.cache
      .filter((x) => x.roles.cache.has(ids.headEvents))
      .map((x) => `<@${x.id}> - ${x.user.tag}`)
      .join("\n> ")}\n`
    m2 += `**Event Host**\n> ${tma.members.cache
      .filter((x) => x.roles.cache.has(ids.eventHosts) && !x.roles.cache.has(ids.headEvents))
      .map((x) => `<@${x.id}> - ${x.user.tag}`)
      .join("\n> ")}\n`
    m2 += `**Level Creator**\n> ${tma.members.cache
      .filter((x) => x.roles.cache.has(ids.levelCreators))
      .map((x) => `<@${x.id}> - ${x.user.tag}`)
      .join("\n> ")}\n`
    m2 += `**Anticheat Team**\n> ${tma.members.cache
      .filter((x) => x.roles.cache.has(ids.anticheat))
      .map((x) => `<@${x.id}> - ${x.user.tag}`)
      .join("\n> ")}\n`
    msg.edit(m)
    msg2.edit(m2)
    console.log("Stafflist complete!")
  })
}
