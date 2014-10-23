var Model = require('../../lib/models/user')

describe('User', function() {

  beforeEach(rebuildDb)
  beforeEach(function(done) {
    seedUsers({email: 'jake@test.com'}, done)
  })

  it('returns a single user', function(done) {
    Model.find(1, function(err, user) {
      assert(!err)
      assert(user.id === 1)
      assert(user.hasOwnProperty('email'))
      assert(user.hasOwnProperty('first_name'))
      assert(user.hasOwnProperty('last_name'))
      done()
    })
  })

  it('selects all users', function(done) {
    seedUsers(null, function() {
      Model.all(function(err, results) {
        assert(results.length === 2)
        assert(results[0].email === 'jake@test.com')
        assert(results[1].email === 'test@test.com')
        done()
      })
    })
  })

  it('creates a user', function(done) {
    var attributes = {email: 'create@create.com', first_name: 'Create', last_name: 'Test', password: 'ted123', password_confirmation: 'ted123'}
    Model.create(attributes, function(err, user) {
      assert(!err)
      assert(user, 'User was not passed')
      assert(!user.auth_token)
      delete attributes.password
      delete attributes.password_confirmation
      _.each(attributes, function(val, key) {
        assert(user[key] === attributes[key])
      })
      done()
    })
  })

  it('updates a user', function(done) {
    var updatedAttributes = {email: 'update@test.com', first_name: 'Update'}
    Model.update(1, updatedAttributes, function(err, user) {
      assert(!err)
      assert(user.email === 'update@test.com')
      assert(user.first_name === 'Update')
      done()
    })
  })

  it('destroys users', function(done) {
    Model.destroy(1, function(err) {
      Model.find(1, function(err, user) {
        assert(!err)
        assert(!user)
        done()
      })
    })
  })

  it('returns user validation errors', function(done) {
    Model.create({}, function(err) {
      assert(err)
      assert(err.email)
      assert(err.first_name)
      assert(err.last_name)
      assert(err.password)
      assert(err.password_confirmation)
      done()
    })
  })

  it('finds by email and password', function(done) {
    Model.findByAuthentication({email: 'jake@test.com', password: 'ted123'}, function(err, user) {
      assert(user)
      assert(user.email === 'jake@test.com')
      done()
    })
  })

  it('returns an error when the password does not match', function(done) {
    Model.findByAuthentication({email: 'jake@test.com', password: 'ted321'}, function(err, user) {
      assert(err)
      done()
    })
  })

  it('generates an auth token', function(done) {
    Model.find(1, function(err, user) {
      Model.generateAuthToken(user, function(err, user) {
        assert(!err)
        assert(user)
        assert(user.auth_token.length > 0)
        // Ensure there is a one week expiry
        assert(user.auth_token_expires_at > (new Date().getTime() + 604000))
        assert(user.auth_token_expires_at < (new Date().getTime() + 604801))
        done()
      })
    })
  })

  it('authenticates with a token', function(done) {
    Model.generateAuthToken({id: 1}, function(err, user) {
      assert(!err)
      Model.authenticateWithToken(user.auth_token, function(err, authUser) {
        assert(!err)
        assert(authUser)
        assert(authUser.auth_token)
        done()
      })
    })
  })

  it('considers a token expired after one-week', function() {
    // one week is 604800 seconds
    var lastWeek = (new Date().getTime() - 604800)
    var overOneWeek = (new Date().getTime() + 100)
    assert(Model.authTokenExpired(lastWeek))
    assert(!Model.authTokenExpired(overOneWeek))
  })

  it('does not authenticate expired auth tokens', function(done) {
    Model.find(1, function(err, user) {
      db.run("UPDATE users set auth_token = 'ted321', auth_token_expires_at = 100 WHERE id=1", function(err, result) {
        Model.authenticateWithToken('ted321', function(err, user) {
          assert(err)
          done()
        })
      })
    })
  })

})