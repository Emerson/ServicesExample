var prependKeys = require('../utils/prepend_keys')
var userIsValid = require('./validations/user')
var Password = require('../utils/password')
var uuid = require('node-uuid')
var db = require('../db')


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

function authTokenExpired(authTokenExpiresAt, now) {
  currentTime = now || new Date().getTime()
  return (authTokenExpiresAt < currentTime)
}

function findByAuthentication(credentials, callback) {
  var findSql = "SELECT * FROM users WHERE email = $email"
  db.get(findSql, {$email: credentials.email}, function(err, user) {
    if(err) { return callback(err) }
    // Check if the password matches
    Password.compare(credentials.password, user.encrypted_password, function(err, isPasswordMatch) {
      if(err) { return callback(err) }
      if(isPasswordMatch) {
        callback(null, user)
      }else{
        callback('Password did not match')
      }
    })
  })
}

function authenticateWithToken(authToken, callback) {
  var sql = "SELECT * FROM users WHERE auth_token = $auth_token"
  db.get(sql, {$auth_token: authToken}, function(err, user) {
    if(err) { return callback(err) }
    if(authTokenExpired(user.auth_token_expires_at)) {
      return callback('Auth token expired')
    }else{
      return callback(null, user)
    }
  })
}

module.exports = {
  all: all,
  find: find,
  create: create,
  update: update,
  destroy: destroy,
  authTokenExpired: authTokenExpired,
  generateAuthToken: generateAuthToken,
  findByAuthentication: findByAuthentication,
  authenticateWithToken: authenticateWithToken
}