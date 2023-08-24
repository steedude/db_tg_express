const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  account: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  chatId: {
    type: Number,
  },
})

const User = model('User', userSchema)
module.exports = User
