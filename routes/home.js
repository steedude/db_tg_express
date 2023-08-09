const express = require('express')
const router = express.Router()
const moment = require('moment')
const { bot } = require('../utils/bot.js')
const { client } = require('../utils/db.js')
const schedule = require('node-schedule')
const { session, Scenes, Markup } = require('telegraf')
const Stage = Scenes.Stage
const WizardScene = Scenes.WizardScene

router.get('/', async (req, res) => {
  return res.status(200).json({
    title: 'Express Testing',
    message: 'The app is working properly!',
  })
})

bot.hears('上班', (ctx) => {
  let chatId = ctx.chat.id
  let time = moment(new Date()).format('YYYY-MM-DD , h:mm:ss a')
  let newTime = moment(new Date()).add(9, 'h').format('YYYY-MM-DD , h:mm:ss a')
  ctx.reply(`上班時間: ${time} \n 預計提示下班時間為: ${newTime}`)
  const job = schedule.scheduleJob(newTime, function () {
    bot.telegram.sendMessage(chatId, '辛苦了，下班囉')
  })
  console.log(job)
})

// bot.hears('dd', (ctx) => {
//   const date = new Date(2012, 11, 21, 5, 30, 0)
//   console.log(date)
// })

bot.command('start', (ctx) => {
  return ctx.reply(
    "請選擇功能或直接輸入'上班'",
    Markup.inlineKeyboard([
      Markup.button.callback('註冊', 'register'),
      Markup.button.callback('預約', 'reserve'),
    ])
  )
})

const registerWizard = new WizardScene(
  'register-wizard',
  (ctx) => {
    ctx.reply('請輸入英文名稱，或輸入cancel退出')
    ctx.wizard.state.data = {}
    return ctx.wizard.next()
  },
  (ctx) => {
    if (ctx.message.text == 'mark') {
      return ctx.reply('名稱重複')
    }
    if (ctx.message.text == 'cancel') {
      return ctx.scene.leave()
    }
    ctx.wizard.state.data.name = ctx.message.text
    ctx.reply('請輸入密碼，或輸入cancel退出')
    return ctx.wizard.next()
  },
  async (ctx) => {
    if (ctx.message.text == 'cancel') {
      return ctx.scene.leave()
    }
    ctx.wizard.state.data.passward = ctx.message.text
    try {
      const database = client.db('mainDB')
      const collection = database.collection('member')
      const doc = {
        name: ctx.wizard.state.data.name,
        passward: ctx.wizard.state.data.passward,
        chatId: ctx.chat.id,
      }
      const result = await collection.insertOne(doc)
      console.log(result)
      ctx.reply(
        `已成功註冊，name: ${ctx.wizard.state.data.name}，passward:${ctx.wizard.state.data.passward}`
      )
    } catch (e) {
      ctx.reply(e)
    }
    return ctx.scene.leave()
  }
)

const reserveWizard = new WizardScene(
  'reserve-wizard',
  (ctx) => {
    ctx.reply(
      '請輸入月份',
      Markup.keyboard([
        ['01月', '02月', '03月', '04月'],
        ['05月', '06月', '07月', '08月'],
        ['09月', '10月', '11月', '12月'],
      ])
        .oneTime()
        .resize()
    )
    ctx.wizard.state.data = {}
    return ctx.wizard.next()
  },
  (ctx) => {
    ctx.wizard.state.data.month = ctx.message.text
    ctx.reply(
      '請輸入日期',
      Markup.keyboard([
        ['01號', '02號', '03號', '04號', '05號'],
        ['06號', '07號', '08號', '09號', '10號'],
        ['11號', '12號', '13號', '14號', '15號'],
        ['16號', '17號', '18號', '19號', '20號'],
        ['21號', '22號', '23號', '24號', '25號'],
        ['26號', '27號', '28號', '29號', '30號', '31號'],
      ])
        .oneTime()
        .resize()
    )
    return ctx.wizard.next()
  },
  (ctx) => {
    ctx.wizard.state.data.date = ctx.message.text
    ctx.reply(
      '請輸入小時',
      Markup.keyboard([
        ['00', '01', '02', '03', '04', '05', '06', '07'],
        ['08', '09', '10', '11', '12', '13', '14', '15'],
        ['16', '17', '18', '19', '20', '21', '22', '23'],
      ])
        .oneTime()
        .resize()
    )
    return ctx.wizard.next()
  },
  (ctx) => {
    ctx.wizard.state.data.hour = ctx.message.text
    ctx.reply(
      '請輸入分鐘',
      Markup.keyboard([
        ['00', '01', '02', '03', '04', '05', '06', '07'],
        ['08', '09', '10', '11', '12', '13', '14', '15'],
        ['16', '17', '18', '19', '20', '21', '22', '23'],
        ['24', '25', '26', '27', '28', '29', '30', '31'],
        ['32', '33', '34', '35', '36', '37', '38', '39'],
        ['40', '41', '42', '43', '44', '45', '46', '47'],
        ['48', '49', '50', '51', '52', '53', '54', '55'],
        ['56', '57', '58', '59'],
      ])
        .oneTime()
        .resize()
    )
    return ctx.wizard.next()
  },
  (ctx) => {
    ctx.wizard.state.data.mins = ctx.message.text
    ctx.reply('請輸入提醒內容')
    return ctx.wizard.next()
  },
  async (ctx) => {
    ctx.wizard.state.data.msg = ctx.message.text
    let datas = ctx.wizard.state.data
    const date = moment(
      `2023-${datas.month.slice(0, 2)}-${datas.date.slice(0, 2)}, ${
        datas.hour
      }:${datas.mins}`,
      'YYYY-MM-DD, hh:mm'
    ).format('YYYY-MM-DD, hh:mm')
    const job = schedule.scheduleJob(date, function () {
      bot.telegram.sendMessage(ctx.chat.id, datas.msg)
    })
    console.log(job)
    ctx.reply(`將於${date}提醒您：${datas.msg}`)
    return ctx.scene.leave()
  }
)
const stage = new Stage([registerWizard, reserveWizard])

bot.use(session())
bot.use(stage.middleware())

bot.action('register', async (ctx, next) => {
  return ctx.reply('開始預約').then(() => {
    ctx.scene.enter('register-wizard')
    next()
  })
})
bot.action('reserve', async (ctx, next) => {
  return ctx.reply('開始預約').then(() => {
    ctx.scene.enter('reserve-wizard')
    next()
  })
})

bot.launch()

module.exports = router
