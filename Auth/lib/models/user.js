var prependKeys = require('../utils/prepend_keys')
var userIsValid = require('./validations/user')
var Password = require('../utils/password')
var db = require('../db')

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

function findByAuthentication(username, password) {
  return null
}

module.exports = {
  all: all,
  find: find,
  create: create,
  findByAuthentication: findByAuthentication
}