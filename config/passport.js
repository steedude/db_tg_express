const passport = require('passport')
// const passportLocal = require('passport-local')
const passportJWT = require('passport-jwt')
// const bcrypt = require('bcrypt')
const { ObjectId } = require('mongodb')
const { collection } = require('../utils/db.js')
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })

// const LocalStrategy = passportLocal.Strategy
const { Strategy: JwtStrategy, ExtractJwt } = passportJWT

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
}

// passport.use(
//   new LocalStrategy(
//     {
//       usernameField: 'account',
//       passwordField: 'password',
//     },
//     async (account, password, done) => {
//       console.log(account)
//       console.log(password)
//       return done(null, { title: '123' })
//     }
//   )
// )

passport.use(
  new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
    const myid = new ObjectId(jwt_payload.id)
    const query = { _id: myid }
    const searchResult = await collection.findOne(query)
    if (searchResult == null) {
      return done(null, false, { title: 'error', message: 'wrong token' })
    }
    return done(null, searchResult)
  })
)

//以下session: false時用不到
// passport.serializeUser((user, done) => {
//   done(null, user._id)
// })

// passport.deserializeUser((id, done) => {
//   console.log(id)
//   done()
// })

module.exports = passport
