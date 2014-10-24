module.exports = function(app) {

  require('./controllers/users')(app)
  require('./controllers/authentications')(app)

}