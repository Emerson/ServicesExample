var User = require('../models/user')
var ApiError = require('../utils/api_error')

module.exports = function(app) {

  app.post('/api/v1/users/authenticate', function(req, res) {
    User.findByAuthentication(req.body)
      .then(function(user) {
        user.generateAuthToken().then(function(user) {
          res.json({user: user})
        })
        .catch(function(err) {
          ApiError.internalError(res, err)
        })
      })
      .catch(function(err) {
        ApiError.unauthorized(res, err)
      })
  })

  app.get('/api/v1/users/authenticate/:token', function(req, res) {
    User.authenticateWithToken(req.params.token).then(function(user) {
      res.json({user: User.serialize(user)})
    }).catch(function(err) {
      ApiError.unauthorized(res, {authenticated: false})
    })
  })

  app.delete('/api/v1/users/authenticate/:token', function(req, res) {
    User.logout(req.params.token).then(function() {
      res.json({logged_out: true})
    }).catch(function(err) {
      res.json({logged_out: err})
    })
  })

}