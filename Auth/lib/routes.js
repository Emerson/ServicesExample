var User = require('./models/user')

module.exports = function(app) {

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

  })

  app.put('/api/v1/users/:id', function(req, res) {

  })

  app.delete('/api/v1/users/:id', function(req, res) {

  })

}