process.env.NODE_ENV = 'test'

//-- Global variables used through our tests ------------------------------
global.db = require('../lib/db')
global.assert = require('assert')
global._ = require('lodash')

//-- Modules required for our helpers -------------------------------------
var prependKeys = require('../lib/utils/prepend_keys')
var Password = require('../lib/utils/password')
var dbConfig = require('../config/database')
var sqlite3 = require('sqlite3').verbose()
var exec = require('child_process').exec
var fs = require('fs')

//-- Globalized helpers ---------------------------------------------------
global.rebuildDb = function(done) {
  fs.unlink(dbConfig.test.filename)
  exec('db-migrate up --config ./config/database.json -e test', function(err, stdout, stderr) {
    global.db = new sqlite3.Database(dbConfig.test.filename, sqlite3.OPEN_READWRITE)
    done()
  })
}

global.seedUsers = function(attributes, done) {
  var user = {$email: 'test@test.com', $first_name: 'first', $last_name: 'last', $password: 'ted123'}
  if(attributes) {
    attributes = prependKeys(attributes)
    user = _.defaults(attributes, user)
  }
  var sql = "INSERT INTO users (email, first_name, last_name, encrypted_password) VALUES ($email, $first_name, $last_name, $encrypted_password)"
  Password.encrypt(user.$password, function(err, encryptedPassword) {
    user.$encrypted_password = encryptedPassword
    delete user.$password
    db.run(sql, user, done)
  })
}