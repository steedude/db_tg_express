const express = require('express')
const moment = require('moment')
const router = express.Router()
const schedule = require('node-schedule')
const { client } = require('../utils/db.js')
const { bot } = require('../utils/bot.js')

router.get('/:name', async (req, res) => {
  let userName = req.params.name
  let newTime = moment(new Date()).add(3, 's').format()
  try {
    const database = client.db('mainDB')
    const collection = database.collection('member')
    const query = { name: userName }
    const options = {
      sort: { 'imdb.rating': -1 },
      projection: { _id: 0, name: 1, chatId: 1 },
    }
    const result = await collection.findOne(query, options)
    const job = schedule.scheduleJob(newTime, function () {
      bot.telegram.sendMessage(result.chatId, '3秒鐘過去了')
    })
    console.log(job)
  } finally {
    await client.close()
  }

  return res.status(200).json({
    title: 'Express Testing......',
    message: 'The app is working properly!',
  })
})

module.exports = router
