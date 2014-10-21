var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var User = require('./models/user')

passport.use(new LocalStrategy(
  function(email, password, done) {
    User.findByAuthentication({email: email, password: password}, function(err, user) {
      if(err) { return done(err) }
      if(!user) {
        return done(null, false, {message: 'Invalid user'})
      }
      return done(null, user)
    })
  }
))