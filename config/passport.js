const passport = require('passport')
const passportLocal = require('passport-local')
const passportJWT = require('passport-jwt')
// const bcrypt = 'bcryptjs'
const { User } = '../models/user'
const { ObjectId } = require('mongodb')
const { collection } = require('../utils/db.js')
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })

const LocalStrategy = passportLocal.Strategy
const { Strategy: JwtStrategy, ExtractJwt } = passportJWT

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
}

passport.use(
  new LocalStrategy(
    {
      usernameField: 'account',
      passwordField: 'password',
    },
    (account, password, done) => {
      console.log(account)
      console.log(password)
      done(null, { message: 'This account is not registered' })
      // User.findOne({ account }).then(user => {
      //   if (!user) {
      //     return done(null, false, { message: 'This account is not registered' });
      //   }

      //   bcrypt.compare(password, user.password, (err, isMatch) => {
      //     if (err) throw err;
      //     return isMatch
      //       ? done(null, user)
      //       : done(null, false, { message: 'account or password incorrect' });
      //   });
      // });
    }
  )
)

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

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user)
  })
})

module.exports = passport
