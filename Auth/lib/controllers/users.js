var formatErrors = require('../helpers/format-errors')
var ApiError = require('../utils/api_error')
var User = require('../models/user')


module.exports = function(app) {

  //-- Index --------------------------------------------------------------
  app.get('/api/v1/users', function(req, res) {
    User.findAll()
      .then(function(users) {
        res.json({users: users})
      }, function(err) {
        ApiError.internalError(res, {status: 'Unknown Error'})
      })
  })

  //-- Show ---------------------------------------------------------------
  app.get('/api/v1/users/:id', function(req, res) {
    User.find(req.params.id).then(function(user) {
      if(!user) { return ApiError.notFound(res, {status: 'Not Found'}) }
      res.json({user: user})
    }).catch(function(err) {
      ApiError.notFound(res, {status: 'Not Found'})
    })
  })

  //-- Create -------------------------------------------------------------
  app.post('/api/v1/users', function(req, res) {
    var attributes = User.filterParams(req.body.user)
    User.create(attributes).then(function(user) {
      user.generateAuthToken().then(function(user) {
        res.json({user: User.serialize(user)})
      })
    }).catch(function(err) {
      return ApiError.unprocessableEntity(res, formatErrors(err.errors))
    })
  })

  //-- Update -------------------------------------------------------------
  app.patch('/api/v1/users/:id', function(req, res) {
    User.find(req.params.id)
      .then(function(user) {
        return user.updateAttributes(req.body.user)
      })
      .then(function(updated) {
        res.json({user: updated})
      })
      .catch(function(err) {
        res.json({error: err})
      })
  })

  //-- Destroy ------------------------------------------------------------
  app.delete('/api/v1/users/:id', function(req, res) {
    User.find(req.params.id).then(function(user) {
      if(!user) { return ApiError.notFound(res, {status: 'Not Found'}) }
      user.destroy().then(function() {
        res.json({user: null})
      }).catch(function() {
        ApiError.internalError(res, {status: 'Unknown error deleting user'})
      })
    })
  })

}