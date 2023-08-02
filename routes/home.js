const express = require("express");
const router = express.Router();
const moment = require('moment');
const { bot } = require("../utils/bot.js");
const { client } = require("../utils/db.js");
const schedule = require('node-schedule');

router.get("/", async (req, res, next) => {
  return res.status(200).json({
    title: "Express Testing",
    message: "The app is working properly!",
  });
});

bot.onText(/\/start/, function (msg) {
  let chatId = msg.chat.id; 
  let resp = '你好，第一次使用請輸入「/reg <自己的名字>」以註冊使用者'; //括號裡面的為回應內容，可以隨意更改
  bot.sendMessage(chatId, resp); //發送訊息的function
});

bot.onText(/\/reg (.+)/, async function (msg, match) {
  let fromId = msg.from.id; //用戶的ID
  let resp = match[1];
  try {
    const database = client.db("mainDB");
    const collection = database.collection("member");
    const doc = {
      name: resp,
      chatId: fromId,
    }
    const result = await collection.insertOne(doc);
    console.log(`A document was inserted with the _id: ${result.insertedId}`)
    bot.sendMessage(fromId, `A document was inserted with the _id: ${result.insertedId}`)
  } finally {
    await client.close();
  }
});

bot.onText(/上班/, async function (msg) {
  let chatId = msg.from.id;
  time = moment(new Date).format('YYYY-MM-DD , h:mm:ss a')
  newTime = moment(new Date).add(9, 'h').format('YYYY-MM-DD , h:mm:ss a')
  bot.sendMessage(chatId, `上班時間: ${time} \n 預計提示下班時間為: ${newTime}`)
  const job = schedule.scheduleJob(newTime, function(){
    bot.sendMessage(chatId, '辛苦了，下班囉');
  });
});
module.exports = router;
