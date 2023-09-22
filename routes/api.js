const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const User = require('../models/user')

require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })

//----註冊-----
router.post('/register', async (req, res) => {
  const { username, password, confirmPassword } = req.body
  //防呆
  if (!username || !password || !confirmPassword) {
    return res.status(400).json({ resultCode: 401 })
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ resultCode: 402 })
  }
  try {
    //確認有無重複帳號
    const searchResult = await User.findOne({ username: username })
    if (searchResult != null) {
      return res.status(400).json({ resultCode: 403 })
    }
    //新增帳號
    const doc = {
      username: username,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
    }
    const insertResult = await User.create(doc)
    return res.status(200).json({
      resultCode: 200,
      resultMap: {
        token: jwt.sign({ id: insertResult._id }, process.env.JWT_SECRET),
      },
    })
  } catch (err) {
    return res
      .status(400)
      .json({ resultCode: 400, resultMap: { message: err } })
  }
})

//-----登入-----
router.post('/login', async (req, res) => {
  const { username, password } = req.body
  //防呆
  if (!username || !password) {
    return res.status(400).json({ resultCode: 401 })
  }
  try {
    const searchResult = await User.findOne({ username: username })
    //帳號或密碼錯誤
    if (
      searchResult == null ||
      !bcrypt.compareSync(password, searchResult.password)
    ) {
      return res.status(400).json({ resultCode: 404 })
    } else {
      return res.json({
        resultCode: 200,
        resultMap: {
          token: jwt.sign({ id: searchResult._id }, process.env.JWT_SECRET),
        },
      })
    }
  } catch (err) {
    return res
      .status(400)
      .json({ resultCode: 400, resultMap: { message: err } })
  }
})

//-----測試拿資料-----
router.get(
  '/test',
  passport.authenticate('token', {
    session: false,
  }),
  async (req, res) => {
    console.log(req.user.username + ' get data')
    return res.status(200).json({
      resultCode: 200,
      resultMap: {
        data: [1, 2, 3, 4],
      },
    })
  }
)

module.exports = router
