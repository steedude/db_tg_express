const express = require("express");
const router = express.Router();
const moment = require('moment');
const { bot } = require("../utils/bot.js");
const { client } = require("../utils/db.js");
const schedule = require('node-schedule');
const { Markup } = require('telegraf')

router.get("/", async (req, res, next) => {
  return res.status(200).json({
    title: "Express Testing",
    message: "The app is working properly!",
  });
});

// bot.onText(/\/start/, function (msg) {
//   let chatId = msg.chat.id; 
//   let resp = '你好，第一次使用請輸入「/reg <自己的名字>」以註冊使用者'; //括號裡面的為回應內容，可以隨意更改
//   bot.sendMessage(chatId, resp); //發送訊息的function
// });

// bot.onText(/\/reg (.+)/, async function (msg, match) {
//   let fromId = msg.from.id; //用戶的ID
//   let resp = match[1];
//   try {
//     const database = client.db("mainDB");
//     const collection = database.collection("member");
//     const doc = {
//       name: resp,
//       chatId: fromId,
//     }
//     const result = await collection.insertOne(doc);
//     console.log(`A document was inserted with the _id: ${result.insertedId}`)
//     bot.sendMessage(fromId, `A document was inserted with the _id: ${result.insertedId}`)
//   } finally {
//     await client.close();
//   }
// });

// bot.onText(/上班/, async function (msg) {
//   let chatId = msg.from.id;
//   time = moment(new Date).format('YYYY-MM-DD , h:mm:ss a')
//   newTime = moment(new Date).add(9, 'h').format('YYYY-MM-DD , h:mm:ss a')
//   bot.sendMessage(chatId, `上班時間: ${time} \n 預計提示下班時間為: ${newTime}`)
//   const job = schedule.scheduleJob(newTime, function(){
//     bot.sendMessage(chatId, '辛苦了，下班囉');
//   });
// });




// bot.command('onetime', (ctx) =>
//   ctx.reply('One time keyboard', Markup
//     .keyboard(['/simple', '/inline', '/pyramid'])
//     .oneTime()
//     .resize()
//   )
// )

// bot.command('custom', async (ctx) => {
//   return await ctx.reply('Custom buttons keyboard', Markup
//     .keyboard([
//       ['🔍 Search', '😎 Popular'], // Row1 with 2 buttons
//       ['☸ Setting', '📞 Feedback'], // Row2 with 2 buttons
//       ['📢 Ads', '⭐️ Rate us', '👥 Share'] // Row3 with 3 buttons
//     ])
//     .oneTime()
//     .resize()
//   )
// })

// bot.hears('🔍 Search', ctx => ctx.reply('Yay!'))
// bot.hears('📢 Ads', ctx => ctx.reply('Free hugs. Call now!'))

// bot.command('special', (ctx) => {
//   return ctx.reply(
//     'Special buttons keyboard',
//     Markup.keyboard([
//       Markup.button.contactRequest('Send contact'),
//       Markup.button.locationRequest('Send location')
//     ]).resize()
//   )
// })

// bot.command('pyramid', (ctx) => {
//   return ctx.reply(
//     'Keyboard wrap',
//     Markup.keyboard(['one', 'two', 'three', 'four', 'five', 'six'], {
//       wrap: (btn, index, currentRow) => currentRow.length >= (index + 1) / 2
//     })
//   )
// })

// bot.command('simple', (ctx) => {
//   return ctx.replyWithHTML(
//     '<b>Coke</b> or <i>Pepsi?</i>',
//     Markup.keyboard(['Coke', 'Pepsi'])
//   )
// })

// bot.command('inline', (ctx) => {
//   return ctx.reply('<b>Coke</b> or <i>Pepsi?</i>', {
//     parse_mode: 'HTML',
//     ...Markup.inlineKeyboard([
//       Markup.button.callback('Coke', 'Coke'),
//       Markup.button.callback('Pepsi', 'Pepsi')
//     ])
//   })
// })

// bot.command('random', (ctx) => {
//   return ctx.reply(
//     'random example',
//     Markup.inlineKeyboard([
//       Markup.button.callback('Coke', 'Coke'),
//       Markup.button.callback('Dr Pepper', 'Dr Pepper', Math.random() > 0.5),
//       Markup.button.callback('Pepsi', 'Pepsi')
//     ])
//   )
// })

// bot.command('caption', (ctx) => {
//   return ctx.replyWithPhoto({ url: 'https://picsum.photos/200/300/?random' },
//     {
//       caption: 'Caption',
//       parse_mode: 'Markdown',
//       ...Markup.inlineKeyboard([
//         Markup.button.callback('Plain', 'plain'),
//         Markup.button.callback('Italic', 'italic')
//       ])
//     }
//   )
// })

// bot.hears(/\/wrap (\d+)/, (ctx) => {
//   return ctx.reply(
//     'Keyboard wrap',
//     Markup.keyboard(['one', 'two', 'three', 'four', 'five', 'six'], {
//       columns: parseInt(ctx.match[1])
//     })
//   )
// })

// bot.action('Dr Pepper', (ctx, next) => {
//   return ctx.reply('👍').then(() => next())
// })

// bot.action('plain', async (ctx) => {
//   await ctx.answerCbQuery()
//   await ctx.editMessageCaption('Caption', Markup.inlineKeyboard([
//     Markup.button.callback('Plain', 'plain'),
//     Markup.button.callback('Italic', 'italic')
//   ]))
// })

// bot.action('italic', async (ctx) => {
//   await ctx.answerCbQuery()
//   await ctx.editMessageCaption('_Caption_', {
//     parse_mode: 'Markdown',
//     ...Markup.inlineKeyboard([
//       Markup.button.callback('Plain', 'plain'),
//       Markup.button.callback('* Italic *', 'italic')
//     ])
//   })
// })

// bot.action(/.+/, (ctx) => {
//   return ctx.answerCbQuery(`Oh, ${ctx.match[0]}! Great choice`)
// })

// bot.launch()

const { Telegraf, session, Scenes } = require('telegraf');
const Stage = Scenes.Stage
const WizardScene = Scenes.WizardScene
const superWizard = new WizardScene(
  'super-wizard',
  ctx => {
    ctx.reply("What's your name?");
    ctx.wizard.state.data = {};
    return ctx.wizard.next();
  },
  ctx => {
    ctx.wizard.state.data.name = ctx.message.text;
    ctx.reply('Enter your phone number');
    return ctx.wizard.next();
  },
  ctx => {
    ctx.wizard.state.data.phone = ctx.message.text;
    ctx.reply(`Your name is ${ctx.wizard.state.data.name}`);
    ctx.reply(`Your phone is ${ctx.wizard.state.data.phone}`);
    return ctx.scene.leave();
  }
);
const stage = new Stage([superWizard]);

bot.use(session());
bot.use(stage.middleware());
bot.command('id', ctx => {
  ctx.scene.enter('super-wizard');
});
bot.launch();

module.exports = router;
