var prependKeys = require('../utils/prepend_keys')
var userIsValid = require('./validations/user')
var Password = require('../utils/password')
var uuid = require('node-uuid')
var db = require('../db')
var _ = require('lodash')


//-- Internal Methods -----------------------------------------------------
var findById = function(id, callback) {
  var sql = "SELECT * FROM users WHERE id = $id"
  db.get(sql, {$id: id}, function(err, result) {
    if(err) {
      return callback(err)
    }
    callback(null, result)
  })
}

function addPassword(user, callback) {
  Password.encrypt(user.password, function(err, encryptedPassword) {
    if (err) { 
      return callback(err)
    }

    user.encrypted_password = encryptedPassword
    delete user.password
    delete user.password_confirmation

    callback(null, user)
  })
}


//-- Exported Methods -----------------------------------------------------
function all(callback) {
  var sql = "SELECT * FROM users"
  db.all(sql, function(err, results) {
    if(err) { return callback(err) }
    return callback(null, results)
  })
}

function find(id, callback) {
  findById(id, callback)
}

function create(attributes, callback) {
  var createSql = "INSERT INTO users (email, first_name, last_name, encrypted_password) VALUES ($email, $first_name, $last_name, $encrypted_password)"
  attributes = _.pick(attributes, ['email', 'first_name', 'last_name', 'password', 'password_confirmation'])
  userIsValid(attributes, function(err) {
    if(err) { return callback(err) }
    addPassword(attributes, function(err) {
      var user = prependKeys(attributes)
      db.run(createSql, user, function(err) {
        if(err) {
          return callback(err)
        }
        findById(this.lastID, callback)
      })
    })
  })
}

function update(id, updatedAttributes, callback) {
  var sql = "UPDATE users SET "
  var updatePairs = []
  updatedAttributes = _.pick(updatedAttributes, ['email', 'first_name', 'last_name', 'password', 'password_confirmation'])
  Object.keys(updatedAttributes).forEach(function(key, val) {
    updatePairs.push(key + " = $" + key)
  })
  var sql = "UPDATE users SET " + updatePairs.join(', ') + " WHERE id = $id"
  updatedAttributes.id = id
  db.run(sql, prependKeys(updatedAttributes), function(err) {
    if(err) { return callback(err) }
    findById(this.lastID, function(err, user) {
      if(err) { return callback(err) }
      callback(null, user)
    })
  })
}

function destroy(id, callback) {
  var sql = "DELETE FROM users WHERE id = $id"
  db.run(sql, {$id: id}, function(err, result) {
    if(err) { return callback(err) }
    callback(null, result)
  })
}

function generateAuthToken(user, callback) {
  var sql = "UPDATE users SET auth_token = $authToken, auth_token_expires_at = $authTokenExpiresAt WHERE id = $id"
  var authToken = uuid.v1()
  var authTokenExpiresAt = new Date().getTime() + 604800 // 1 week from now
  db.run(sql, {$authToken: authToken, $authTokenExpiresAt: authTokenExpiresAt, $id: user.id}, function(err, result) {
    if(err) { return callback(err) }
    findById(this.lastID, function(err, user) {
      if(err) { return callback(err) }
      callback(null, user)
    })
  })
}

function findByAuthentication(credentials, callback) {
  credentials = _.defaults(credentials, {email: '', password: ''})
  var findSql = "SELECT * FROM users WHERE email = $email"
  db.get(findSql, {$email: credentials.email}, function(err, user) {
    if(err) { return callback(err) }
    if(!user) { return callback({message: 'User not found'}) }
    // Check if the password matches
    Password.compare(credentials.password, user.encrypted_password, function(err, isPasswordMatch) {
      if(err) { return callback(err) }
      if(isPasswordMatch) {
        callback(null, user)
      }else{
        callback({message: 'Password did not match'})
      }
    })
  })
}

function authenticateWithToken(authToken, callback) {
  var sql = "SELECT * FROM users WHERE auth_token = $auth_token AND auth_token_expires_at > $now"
  db.get(sql, {$auth_token: authToken, $now: new Date().getTime()}, function(err, user) {
    if(err) { return callback(err) }
    if(user) {
      return callback(null, user)
    }else{
      return callback(err)
    }
  })
}

function logout(authToken, callback) {
  var sql = "UPDATE users SET auth_token = NULL, auth_token_expires_at = NULL WHERE auth_token = $auth_token"
  db.run(sql, {$auth_token: authToken}, function(err) {
    if(err) { return callback(err) }
    callback(null, true)
  })
}

module.exports = {
  all: all,
  find: find,
  create: create,
  update: update,
  destroy: destroy,
  logout: logout,
  generateAuthToken: generateAuthToken,
  findByAuthentication: findByAuthentication,
  authenticateWithToken: authenticateWithToken
}