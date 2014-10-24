var User = require('../models/user')
var ApiError = require('../utils/api_error')

module.exports = function(app) {

  app.post('/api/v1/users/authenticate', function(req, res) {
    User.findByAuthentication(req.body, function(err, user) {
      if(err) {}
      res.json({user: user})
    })
  })

  app.get('/api/v1/users/authenticate/:token', function(req, res) {
    User.authenticateWithToken(req.params.token, function(err, user) {
      if(err) {}
      if(user) {
        res.json({authenticated: true})
      }else{
        ApiError.unauthorized(res, {authenticated: false})
      }
    })
  })

  app.delete('/api/v1/users/authenticate/:token', function(req, res) {
    User.logout(req.params.token, function(err) {
      if(err) {}
      res.json({logged_out: true})
    })
  })

}