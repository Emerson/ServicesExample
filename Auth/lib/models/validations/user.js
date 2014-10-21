var validator = require('validator');

module.exports = function(user, callback) {
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

  if(_.keys(errors).length === 0) {
    callback(null)
  }else{
    callback(errors)
  }

}
