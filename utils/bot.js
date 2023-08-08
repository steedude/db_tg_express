require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })
const token = process.env.BOT_TOKEN
const { Telegraf } = require('telegraf')
const bot = new Telegraf(token)

module.exports = { bot }
