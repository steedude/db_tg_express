const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const passportJWT = require('passport-jwt')

const LocalStrategy = require('passport-local').Strategy
const JWTStrategy = passportJWT.Strategy

const extractJWT = passportJWT.ExtractJwt

const secret_key = 'secret'

const User = require('./user')

const checkPassword = (user, password) =>
  bcrypt
    .compare(password, user.password)
    .then((result) => (result ? Promise.resolve(user) : Promise.reject(null)))

passport.use(
  'signin',
  new LocalStrategy((username, password, done) => {
    User.findOne(username)
      .then((user) => checkPassword(user, password))
      .then((user) => done(null, user))
      .catch((err) => done(err, false))
  })
)

passport.use(
  'token',
  new JWTStrategy(
    {
      jwtFromRequest: extractJWT.fromBodyField('token'),
      secretOrKey: secret_key,
    },
    (jwtPayload, done) => {
      User.findById(jwtPayload._id)
        .then((user) => done(null, user))
        .catch((err) => done(err))
    }
  )
)

const signinMW = (req, res) => {
  const token = jwt.sign(req.user, secret_key)
  res.json(token)
}

module.exports = signinMW
