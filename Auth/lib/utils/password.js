var bcrypt = require('bcrypt')

module.exports = {

  encrypt: function(password, callback) {
    bcrypt.genSalt(10, function(err, salt) {
      if(err)
        return callback(err)
      bcrypt.hash(password, salt, function(err, hash) {
        return callback(err, hash)
      })
    })
  },

  compare: function(encryptedPassword, userPassword, callback) {
    bcrypt.compare(encryptedPassword, userPassword, function(err, isPasswordMatch) {
      if(err)
        return callback(err)
      return callback(null, isPasswordMatch)
    })
  }

}