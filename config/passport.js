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
  passReqToCallback: true,
}
// const localOptions = {
//   passReqToCallback: true,
// }

// const checkPassword = (user, password) =>
//   bcrypt
//     .compare(password, user.password)
//     .then((result) => (result ? Promise.resolve(user) : Promise.reject(null)))

// passport.use(
//   'signin',
//   new LocalStrategy(localOptions,(username, password, done) => {
//     User.findOne(username)
//       .then((user) => checkPassword(user, password))
//       .then((user) => done(null, user))
//       .catch((err) => done(err, false))
//   })
// )

passport.use(
  'token',
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
