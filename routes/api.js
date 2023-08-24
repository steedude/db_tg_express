const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const User = require('../models/user')

require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })

//----註冊-----
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
  try {
    const searchResult = await User.findOne({ account: account })
    if (searchResult != null) {
      return res.status(400).json({
        title: 'error',
        message: 'Duplicate account',
      })
    }
  } catch (e) {
    return res.status(400).json({
      title: 'error',
      message: e,
    })
  }
  //新增帳號
  const doc = {
    account: account,
    password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
  }
  try {
    const insertResult = await User.create(doc)
    return res.status(200).json({
      title: 'success',
      message: 'A document was inserted',
      resultMap: {
        insertedId: insertResult.insertedId,
        token: jwt.sign({ id: insertResult._id }, process.env.JWT_SECRET),
      },
    })
  } catch (e) {
    return res.status(400).json({
      title: 'error',
      message: e,
    })
  }
})

//-----登入-----
router.post('/login', function (req, res, next) {
  passport.authenticate('login', function (err, user, info) {
    //DB如果有報錯
    if (err) {
      return res.status(400).json({
        title: 'error',
        message: err,
      })
    }
    // 如果找不到使用者或密碼錯誤
    if (!user) {
      return res.status(401).json({
        title: 'error',
        message: info.message,
      })
    }

    //沒問題就發token
    return res.status(200).json({
      title: 'success',
      message: 'login success',
      resultMap: {
        token: jwt.sign({ id: user._id }, process.env.JWT_SECRET),
      },
    })
  })(req, res, next)
})

//-----測試拿資料-----
router.get(
  '/test',
  passport.authenticate('token', {
    session: true,
  }),
  async (req, res) => {
    console.log(req.user)
    return res.status(200).json({
      title: 'success',
      message: 'get data success',
      resultMap: {
        data: [1, 2, 3, 4],
      },
    })
  }
)

module.exports = router
