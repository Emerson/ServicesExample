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
var User = require('../lib/models/user')
var exec = require('child_process').exec
var bodyParser = require('body-parser')
var routes = require('../lib/routes')
var express = require('express')
var fs = require('fs')


//-- Globalized helpers ---------------------------------------------------
global.rebuildDb = function(done) {
  global.db.query('TRUNCATE users RESTART IDENTITY')
    .done(function(err) {
      if(err) {
        process.exit("There was a problem rebuilding the database")
      }
      done();
    })
}

global.setupApp = function() {
  var app = express()
  app.use(bodyParser.json())
  routes(app)
  return app
}

global.seedUsers = function(attributes, done) {
  var user = {
    email: 'test@test.com',
    first_name: 'first',
    last_name: 'last',
    password: 'ted123',
    password_confirmation: 'ted123',
    auth_token: 'xxxxxx',
    auth_token_expires_at: (new Date().getTime() + 604000)
  }
  if(attributes) {
    user = _.defaults(attributes, user)
  }
  User.create(user).then(function(savedUser) {
    User.find(1).then(function(savedGuy) {
      done()
    })
  }).catch(function(err) {
    console.log("Error", err)
    process.exit()
  })
  // Password.encrypt(user.password, function(err, encryptedPassword) {
  //   user.encrypted_password = encryptedPassword
  //   delete user.password
  //   User.create(user)
  //     .done(function(user) {
  //       done()
  //     }, function() {
  //       process.exit('There was a problem seeding the user', user)
  //     })
  // })
}