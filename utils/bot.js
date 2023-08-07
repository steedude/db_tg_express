const token = '6359990785:AAGNEIUUwgdSK2BtF2PWgqj9i--v_XzDZXQ';
// const TelegramBot = require('node-telegram-bot-api');
// const bot = new TelegramBot(token, { polling: true });
const { Telegraf } = require('telegraf')
const bot = new Telegraf(token)

module.exports = { bot };