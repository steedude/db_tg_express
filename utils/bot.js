const TelegramBot = require('node-telegram-bot-api');
const token = '6359990785:AAGNEIUUwgdSK2BtF2PWgqj9i--v_XzDZXQ';
const bot = new TelegramBot(token, { polling: true });

module.exports = { bot };