var _ = require('lodash')
var db = require('../../db')
var validator = require('validator')

var isUniqueEmail = function(email, callback) {
  var sql = "SELECT COUNT(*) FROM users WHERE email = $email"
  db.get(sql, {$email: email}, function(err, result) {
    if(err) { return callback(err) }
    if(result['COUNT(*)'] > 0) {
      callback(true)
    }else{
      callback(null)
    }
  })
}

module.exports = function(user, callback) {
  if(!user){user = {}}
  user = _.defaults(user, {email: '', first_name: '', last_name: '', password: '', password_confirmation: ''})
  var errors = {}

  user.first_name = validator.toString(user.first_name)
  user.last_name = validator.toString(user.last_name)
  user.email = validator.toString(user.email)
  user.password = validator.toString(user.password)
  user.password_confirmation = validator.toString(user.password_confirmation)

  if(!validator.isEmail(user.email)) {
    errors.email = ['You must provide a valid email address']
  }

  if(user.first_name.length === 0) {
    errors.first_name = ['You must provide a first name']
  }

  if(user.last_name.length === 0) {
    errors.last_name = ['You must provide a last name']
  }

  if(user.password.length === 0) {
    errors.password = ['You must provide a password']
  }

  if(user.password_confirmation.length === 0) {
    errors.password_confirmation = ['You must provide a password_confirmation']
  }

  if(user.password != user.password_confirmation) {
    errors.password_confirmation = ['Your password and password confirmation must match']
  }

  isUniqueEmail(user.email, function(err) {
    if(err) {
      errors.email = ['That email has already been registered']
    }
    if(_.keys(errors).length === 0) {
      callback(null)
    }else{
      callback(errors)
    }
  })

}
