const { ids } = require("../../config")

module.exports = {
  command: {
    name: "teamcount",
    description: "Count the number of users in each team",
    defaultPermission: true,
    options: [
      {
        type: "BOOLEAN",
        name: "classes",
        description: "Count classes also?",
        required: false,
      },
    ],
  },
  permissions: [],
  run: async (interaction, client) => {
    let classCount = interaction.options.get("classes")?.value

    let blaze = interaction.guild.roles.cache.get(ids.blaze)
    let aqua = interaction.guild.roles.cache.get(ids.aqua)
    let terra = interaction.guild.roles.cache.get(ids.terra)
    let wizard = interaction.guild.roles.cache.get(ids.wizard)
    let scientist = interaction.guild.roles.cache.get(ids.scientist)
    let assassin = interaction.guild.roles.cache.get(ids.assassin)
    let staff = interaction.guild.roles.cache.get(ids.staff)

    let message = ""

    message += `${aqua ? aqua.members.size : 0} <@&${ids.aqua}> Members\n`
    if (classCount) {
      let wizardAqua = aqua.members.filter((x) => x.roles.cache.has(ids.wizard)).size ?? 0
      let assassinAqua = aqua.members.filter((x) => x.roles.cache.has(ids.assassin)).size ?? 0
      let scientistAqua = aqua.members.filter((x) => x.roles.cache.has(ids.scientist)).size ?? 0
      message += `  - ${wizardAqua} <@&${ids.wizard}>s\n`
      message += `  - ${assassinAqua} <@&${ids.assassin}>s\n`
      message += `  - ${scientistAqua} <@&${ids.scientist}>s\n\n`
    }

    message += `${blaze ? blaze.members.size : 0} <@&${ids.blaze}> Members\n`
    if (classCount) {
      let wizardBlaze = blaze.members.filter((x) => x.roles.cache.has(ids.wizard)).size ?? 0
      let assassinBlaze = blaze.members.filter((x) => x.roles.cache.has(ids.assassin)).size ?? 0
      let scientistBlaze = blaze.members.filter((x) => x.roles.cache.has(ids.scientist)).size ?? 0
      message += `  - ${wizardBlaze} <@&${ids.wizard}>s\n`
      message += `  - ${assassinBlaze} <@&${ids.assassin}>s\n`
      message += `  - ${scientistBlaze}  <@&${ids.scientist}>s\n\n`
    }
    
    message += `${terra ? terra.members.size : 0} <@&${ids.terra}> Members\n`
    if (classCount) {
      let wizardTerra = terra.members.filter((x) => x.roles.cache.has(ids.wizard)).size ?? 0
      let assassinTerra = terra.members.filter((x) => x.roles.cache.has(ids.assassin)).size ?? 0
      let scientistTerra = terra.members.filter((x) => x.roles.cache.has(ids.scientist)).size ?? 0
      message += `  - ${wizardTerra} <@&${ids.wizard}>s\n`
      message += `  - ${assassinTerra} <@&${ids.assassin}>s\n`
      message += `  - ${scientistTerra} <@&${ids.scientist}>s\n\n`
    }

    interaction.reply({content: message, allowedMentions: {roles: []}})
  },
}
