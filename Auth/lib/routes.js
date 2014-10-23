var User = require('./models/user')

module.exports = function(app) {

  //-- RESTful actions ----------------------------------------------------
  app.get('/api/v1/users', function(req, res) {
    User.all(function(err, results) {
      if(err) {}
      res.json({users: results})
    })
  })

  app.get('/api/v1/users/:id', function(req, res) {
    var user = User.find(req.params.id, function(err, user) {
      if(err) {}
      res.json({user: user})
    })
  })

  app.post('/api/v1/users', function(req, res) {
    User.create(req.body, function(err, user) {
      if(err) { return res.json(err) }
      res.json({user: user})
    })
  })

  app.patch('/api/v1/users/:id', function(req, res) {
    User.update(req.params.id, req.body, function(err, user) {
      if(err) {}
      res.json({user: user})
    })
  })

  app.delete('/api/v1/users/:id', function(req, res) {
    User.destroy(req.params.id, function(err) {
      if(err) {}
      res.json({user: null})
    })
  })

  //-- Authentication -----------------------------------------------------
  app.post('/api/v1/users/authenticate', function(req, res) {
    User.findByAuthentication(req.body, function(err, user) {
      if(err) {}
      res.json({user: user})
    })
  })

  app.get('/api/v1/users/authenticate/:token', function(req, res) {
    User.authenticateWithToken(req.params.token, function(err, user) {
      if(err) {}
      res.json({authenticated: true})
    })
  })

}