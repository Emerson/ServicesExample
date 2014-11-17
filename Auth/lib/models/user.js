var prependKeys = require('../utils/prepend_keys')
var Password = require('../utils/password')
var Sequelize = require('sequelize')
var uuid = require('node-uuid')
var db = require('../db')
var _ = require('lodash')
var q = require('q')

function findByAuthentication(credentials) {
  var _this = this;
  credentials = _.defaults(credentials, {email: '', password: ''})
  return new q.Promise(function(resolve, reject) {
    _this.find({where: {email: credentials.email}})
      .then(function(user) {
        if(!user) { return reject('User not found') }
        Password.compare(credentials.password, user.encrypted_password, function(err, isPasswordMatch) {
          if(err) { return reject(err) }
          if(isPasswordMatch) {
            return resolve(user)
          }else{
            return reject('Password did not match')
          }
        })
      })
      .catch(function(err) {
        reject(err)
      })
  })
}

function generateAuthToken() {
  var authToken = uuid.v1()
  var authTokenExpiresAt = new Date().getTime() + 604800 // 1 week from now
  return this.updateAttributes({auth_token: authToken, auth_token_expires_at: authTokenExpiresAt})
}

function authenticateWithToken(authToken) {
  var _this = this
  var promise = new q.Promise(function(resolve, reject) {
    _this.find({where: ['auth_token = ? AND auth_token_expires_at > ?', authToken, Date.now()]}).then(function(user) {
      if(user) {
        resolve(user)
      }else{
        reject('User not found')
      }
    }).catch(function(err) {
      reject(err)
    })
  })
  return promise
}

function logout(authToken) {
  var _this = this
  return new q.Promise(function(resolve, reject) {
    _this.find({where: {auth_token: authToken}}).then(function(user) {
      user.updateAttributes({auth_token: null, auth_token_expires_at: null}).then(function() {
        resolve('Logged out')
      })
    }).catch(function() {
      reject('User not found')
    })
  })
}

function beforeValidateEncryptPassword(user) {
  return new q.Promise(function(resolve, reject) {
    if((user.isNewRecord && user.get('password')) || (user.get('password') && user.get('password').length > 0)) {
      Password.encrypt(user.get('password'), function(err, encryptedPassword) {
        if(err) { return reject(err) }
        user.set('encrypted_password', encryptedPassword)
        resolve(encryptedPassword)
      })
    }else{
      resolve()
    }
  })
}

function passwordsMatch() {
  if(this.isNewRecord || (this.get('password') || this.get('password_confirmation'))) {
    if(this.get('password') !== this.get('password_confirmation')) {
      throw new Error('Password must match password confirmation')
    }
  }
}

function passwordPresent() {
  if(this.isNewRecord) {
    if(!this.get('password') || this.get('password').length === 0) {
      throw new Error('You must provide a password')
    }
  }
}

function passwordConfirmationPresent() {
  if(this.isNewRecord) {
    if(!this.get('password_confirmation') || this.get('password_confirmation').length === 0) {
      throw new Error('You must provide a password confirmation')
    }
  }
}

function serialize(user) {
  return {
    id: user.get('id'),
    email: user.get('email'),
    first_name: user.get('first_name'),
    last_name: user.get('last_name'),
    auth_token: user.get('auth_token'),
    auth_token_expires_at: user.get('auth_token_expires_at')
  }
}

function filterParams(params) {
  if(typeof params !== 'object') {
    params = {}
  }
  var defaultAttributes = {email: '', first_name: '', last_name: '', password: '', password_confirmation: ''}
  params = _.defaults(params, defaultAttributes)
  var whiteList = {};
  _.forOwn(defaultAttributes, function(num, key) {
    whiteList[key] = params[key]
  })
  return whiteList
}

var User = db.define('User', {
  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true,
      notEmpty: true,
      isUnique: function(value) {
        if(!this.isNewRecord) { return true }
        return User.count({where: {email: value}}).then(function(count) {
          if(count > 0) {
            throw new Error('Email address is already registered')
          }
        })
      }
    }
  },
  first_name: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: {
        msg: 'You must provide a first name'
      }
    }
  },
  last_name: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: {
        msg: 'You must provide a last name'
      }
    }
  },
  auth_token: Sequelize.STRING,
  auth_token_expires_at: Sequelize.INTEGER,
  encrypted_password: Sequelize.STRING
}, {
  tableName: 'users',
  underscored: true,
  classMethods: {
    findByAuthentication: findByAuthentication,
    authenticateWithToken: authenticateWithToken,
    logout: logout,
    serialize: serialize,
    filterParams: filterParams
  },
  instanceMethods: {
    generateAuthToken: generateAuthToken
  },
  setterMethods: {
    password: function(val) { this._password = val },
    password_confirmation: function(val) { this._password_confirmation = val }
  },
  getterMethods: {
    password: function() { return this._password },
    password_confirmation: function() { return this._password_confirmation }
  },
  hooks: {
    beforeValidate: beforeValidateEncryptPassword
  },
  validate: {
    passwordsMatch: passwordsMatch,
    password: passwordPresent,
    password_confirmation: passwordConfirmationPresent
  }
})

module.exports = User