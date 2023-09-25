const jsonwebtoken = require('jsonwebtoken')
const User = require('../models/user')

async function verifyJWT(req, res, next) {
  const bearer = req.headers.authorization.split(' ')
  const bearerToken = bearer[1]
  if (!bearerToken) {
    return res.status(401).json({ resultCode: 1005 })
  }
  try {
    const decoded = await jsonwebtoken.verify(
      bearerToken,
      process.env.JWT_SECRET
    )
    const searchResult = await User.findById(decoded.id)
    if (!searchResult) {
      return res.status(401).json({ resultCode: 1006 })
    }
    req.user = searchResult
    next()
  } catch (err) {
    return res.status(401).json({ resultCode: 1007 })
  }
}

module.exports = verifyJWT
