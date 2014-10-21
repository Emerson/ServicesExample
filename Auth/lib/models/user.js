var Password = require('../utils/password')
var prependKeys = require('../utils/prepend_keys')

var findById = function(id, callback) {
  var sql = "SELECT * FROM users WHERE id = $id"
  db.get(sql, {$id: id}, function(err, result) {
    if(err) {
      return callback(err)
    }
    callback(null, result)
  })
}

module.exports = {

  all: function(callback) {
    var sql = "SELECT * FROM users"
    db.all(sql, function(err, results) {
      if(err) {
        return callback(err)
      }
      return callback(null, results)
    })
  },

  find: function(id, callback) {
    findById(id, callback)
  },

  create: function(attributes, callback) {
    var sql = "INSERT INTO users (email, first_name, last_name, encrypted_password) VALUES ($email, $first_name, $last_name, $encrypted_password)"
    Password.encrypt(attributes.password, function(err, encryptedPassword) {
      var user = prependKeys(attributes)
      user.$encrypted_password = encryptedPassword
      delete user.$password
      db.run(sql, user, function(err) {
        if(err) {
          return callback(err)
        }
        findById(this.lastID, function(err, user) {
          if(err) {
            return callback(err)
          }
          return callback(null, user)
        })
      })
    })
  },

  findByAuthentication: function(username, password) {
    return null
  }

}