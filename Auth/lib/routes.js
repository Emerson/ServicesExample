var User = require('./models/user')

module.exports = function(app) {

  app.get('/api/v1/users', function(req, res) {
    var users = User.all()
    res.json({users: users})
  })

  app.get('/api/v1/users/:id', function(req, res) {
    var user = User.find(1)
    res.json({user: user})
  })

  app.post('/api/v1/users', function(req, res) {

  })

  app.put('/api/v1/users/:id', function(req, res) {

  })

  app.delete('/api/v1/users/:id', function(req, res) {

  })

}