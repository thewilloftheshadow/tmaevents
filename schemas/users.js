const mongoose = require("mongoose")

const schema = new mongoose.Schema({
  user: { type: String }, // id of user
  points: { type: Number, default: 0 },
  flags: { type: Array, default: [] }, // flags of user
  date: { type: Date, default: Date.now }, // time they were created
})

module.exports = mongoose.model(`${__filename.split(`${__dirname}/`).pop().split(`.`).shift()}`, schema)
