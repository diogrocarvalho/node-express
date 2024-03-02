import passport from 'passport'
import localStrategy from './strategies/local.strategy'

const passportConfig = (app) => {
  app.use(passport.initialize())
  app.use(passport.session())

  localStrategy()

  passport.serializeUser(function (user, done) {
    done(null, user)
  })

  passport.deserializeUser(function (user, done) {
    done(null, user)
  })
}

export default passportConfig
