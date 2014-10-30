var ApiError = require('../utils/api_error')
var User = require('../models/user')

module.exports = function(app) {

  //-- Index --------------------------------------------------------------
  app.get('/api/v1/users', function(req, res) {
    User.all(function(err, results) {
      if(err) {}
      res.json({users: results})
    })
  })

  //-- Show ---------------------------------------------------------------
  app.get('/api/v1/users/:id', function(req, res) {
    var user = User.find(req.params.id, function(err, user) {
      if(err) {}
      if(!user) { return ApiError.notFound(res, {status: 'Not Found'}) }
      res.json({user: user})
    })
  })

  //-- Create -------------------------------------------------------------
  app.post('/api/v1/users', function(req, res) {
    User.create(req.body.user, function(err, user) {
      if(err) { return ApiError.unprocessableEntity(res, err) }
      res.json({user: user})
    })
  })

  //-- Update -------------------------------------------------------------
  app.patch('/api/v1/users/:id', function(req, res) {
    User.update(req.params.id, req.body.user, function(err, user) {
      if(err) {}
      res.json({user: user})
    })
  })

  //-- Destroy ------------------------------------------------------------
  app.delete('/api/v1/users/:id', function(req, res) {
    User.destroy(req.params.id, function(err) {
      if(err) {}
      res.json({user: null})
    })
  })

}