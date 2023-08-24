const passport = require('passport')
const passportLocal = require('passport-local')
const passportJWT = require('passport-jwt')
// const bcrypt = require('bcrypt')
const { ObjectId } = require('mongodb')
const { collection } = require('../utils/db.js')
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })

const LocalStrategy = passportLocal.Strategy
const { Strategy: JwtStrategy, ExtractJwt } = passportJWT

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
}
const localOptions = {
  usernameField: 'username',
  passwordField: 'password',
  session: false,
}

// const checkPassword = (user, password) =>
//   bcrypt
//     .compare(password, user.password)
//     .then((result) => (result ? Promise.resolve(user) : Promise.reject(null)))

passport.use(
  'local',
  new LocalStrategy(localOptions, (username, password, done) => {
    console.log(username, password)
    const user = 'jason'
    // User.findOne(username)
    //   .then((user) => checkPassword(user, password))
    //   .then((user) => done(null, user))
    //   .catch((err) => done(err, false))
    done(null, user, { message: 'wrong token' })
  })
)
passport.use(
  'test',
  new LocalStrategy(
    {
      passReqToCallback: true,
    },
    (req, username, password, done) => {
      // User.findOne(username)
      //   .then((user) => checkPassword(user, password))
      //   .then((user) => done(null, user))
      //   .catch((err) => done(err, false))
      return done(
        null,
        false,
        req.flash('error_messages', 'incorrect email or password!')
      )
    }
  )
)
passport.use(
  'token',
  new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
    const myid = new ObjectId(jwt_payload.id)
    const query = { _id: myid }
    const searchResult = await collection.findOne(query)
    if (searchResult == null) {
      return done(null, false, { message: 'wrong token' })
    }
    return done(null, searchResult)
  })
)

//以下session: false時用不到
// passport.serializeUser((user, done) => {
//   done(null, user._id)
// })

// passport.deserializeUser(async (_id, done) => {
//   const myid = new ObjectId(_id)
//   const query = { _id: myid }
//   const searchResult = await collection.findOne(query)
//   if (searchResult == null) {
//     return done(null, false, { message: 'wrong token' })
//   }
//   return done(null, searchResult)
// })

module.exports = passport
