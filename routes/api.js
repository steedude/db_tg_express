const express = require('express')
const router = express.Router()
const { collection } = require('../utils/db.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const jwtAuthenticated = passport.authenticate('token', {
  session: false,
  failureRedirect: '/api/error',
  failureMessage: true,
})
// const localAuthenticated = passport.authenticate('local', {
//   session: false,
//   successRedirect: '/',
//   failureRedirect: '/',
// })
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })

//註冊
router.post('/register', async (req, res) => {
  const { account, password, confirmPassword } = req.body
  //防呆
  if (!account || !password || !confirmPassword) {
    return res
      .status(400)
      .json({ title: 'error', message: 'missing information' })
  }
  if (password !== confirmPassword) {
    return res.status(400).json({
      title: 'error',
      message: 'password and confirmPassword are not the same',
    })
  }
  //確認有無重複帳號
  const query = { account: account }
  const options = {
    sort: { 'imdb.rating': -1 },
  }
  const searchResult = await collection.findOne(query, options)
  if (searchResult != null) {
    return res.status(400).json({
      title: 'error',
      message: 'Duplicate account',
    })
  }
  //新增帳號
  const doc = {
    account: account,
    password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
  }
  const insertResult = await collection.insertOne(doc)
  return res.status(200).json({
    title: 'success',
    message: 'A document was inserted',
    resultMap: {
      insertedId: insertResult.insertedId,
      token: jwt.sign({ id: insertResult._id }, process.env.JWT_SECRET),
    },
  })
})

//登入
router.post('/login', async (req, res) => {
  const { account, password } = req.body
  //防呆
  if (!account || !password) {
    return res
      .status(400)
      .json({ title: 'error', message: 'missing information' })
  }
  //確認帳號是否存在
  const query = { account: account }
  const options = {
    sort: { 'imdb.rating': -1 },
  }
  const searchResult = await collection.findOne(query, options)
  //存在的話是否匹配
  if (
    !searchResult.account ||
    !bcrypt.compareSync(password, searchResult.password)
  ) {
    return res
      .status(400)
      .json({ title: 'error', message: 'Incorrect account or password' })
  }
  return res.json({
    title: 'success',
    message: 'login success',
    resultMap: {
      token: jwt.sign({ id: searchResult._id }, process.env.JWT_SECRET),
    },
  })
})

router.get('/test', jwtAuthenticated, async (req, res) => {
  return res.status(200).json({
    title: 'success',
    message: 'get data success',
    resultMap: {
      data: [1, 2, 3, 4],
    },
  })
})

router.get('/error', (req, res) => {
  console.log(req.session)
  delete req.session.error
  delete req.session.message

  // console.log('req = ', req.session.messages)
  // res.render('error')
  return res.status(400).json({
    title: 'error',
  })
})

module.exports = router
