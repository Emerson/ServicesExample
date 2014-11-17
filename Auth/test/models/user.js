var Model = require('../../lib/models/user')
  , formatErrors = require('../../lib/helpers/format-errors')

describe('UserModel', function() {

  beforeEach(rebuildDb)
  beforeEach(function(done) {
    seedUsers({email: 'jake@test.com'}, done)
  })

  it('creates a user', function(done) {
    var attributes = {email: 'create@create.com', first_name: 'Create', last_name: 'Test', password: 'ted123', password_confirmation: 'ted123'}
    Model.create(attributes).then(function(user) {
      delete attributes.password
      delete attributes.password_confirmation
      _.each(attributes, function(val, key) {
        assert(user[key] === attributes[key])
      })
      done()
    })
  })

  it('updates a user', function(done) {
    var attributes = {email: 'update@test.com', first_name: 'Update'}
    Model.find(1).then(function(user) {
      user.updateAttributes(attributes).then(function(updatedUser) {
        assert(user.email === 'update@test.com')
        assert(user.first_name === 'Update')
        done()
      })
    })
  })

  it('destroys users', function(done) {
    Model.destroy(1).then(function() {
      Model.find(1).then(function(user) {
        assert(!user)
        done()
      })
    })
  })

  it('returns user validation errors', function(done) {
    Model.create({first_name: '', last_name: ''}).catch(function(err) {
      var formattedErrors = formatErrors(err.errors)
      assert(formattedErrors.first_name.length == 1)
      assert(formattedErrors.last_name.length == 1)
      done()
    })
  })

  it('encrypts a users password', function(done) {
    var attributes = {password: 'pass', password_confirmation: 'pass', email: 'create@create.com', first_name: 'Create', last_name: 'Test'}
    Model.create(attributes).then(function(user) {
      assert(user.encrypted_password.length > 6)
      done()
    })
  })

  it('finds by email and password', function(done) {
    Model.findByAuthentication({email: 'jake@test.com', password: 'ted123'}).then(function(user) {
      assert(user)
      assert(user.email === 'jake@test.com')
      done()
    })
  })

  it('returns an error when the password does not match', function(done) {
    Model.findByAuthentication({email: 'jake@test.com', password: 'ted321'}).catch(function(err) {
      assert(err)
      done()
    })
  })

  it('validates the uniqueness of a user email', function(done) {
    var attributes = {email: 'jake@test.com', first_name: 'error', last_name: 'error', password: 'ted123', password_confirmation: 'ted123'}
    Model.create(attributes).catch(function(errors) {
      assert(errors.errors[0].message === 'Email address is already registered')
      done()
    })
  })

  it('generates an auth token', function(done) {
    Model.find(1).then(function(user) {
      var previousToken = user.auth_token
      user.generateAuthToken().then(function(user) {
        assert(user.auth_token)
        assert(user.auth_token !== previousToken)
        // Ensure there is a one week expiry
        assert(user.auth_token_expires_at > (new Date().getTime() + 604000))
        assert(user.auth_token_expires_at < (new Date().getTime() + 604801))
        done()
      })
    })
  })

  it('authenticates with a token', function(done) {
    Model.find(1).then(function(user) {
      Model.authenticateWithToken(user.auth_token).then(function(authUser) {
        assert(authUser)
        assert(authUser.auth_token)
        done()
      })
    })
  })

  it('returns an error when the token is invalid', function(done) {
    Model.authenticateWithToken('wrong').catch(function(err) {
      assert(err)
      done()
    })
  })

  it('does not authenticate expires tokens', function(done) {
    Model.find(1).then(function(user) {
      user.updateAttributes({auth_token_expires_at: 100}).success(function() {
        Model.authenticateWithToken('xxxxxx').catch(function(err) {
          done()
        })
      })
    })
  })

  it('clears the auth_token on logout', function(done) {
    Model.logout('xxxxxx').then(function(msg) {
      Model.find(1).then(function(user) {
        assert(user.auth_token_expires_at === null)
        assert(user.auth_token === null)
        done()
      })
    })
  })

})