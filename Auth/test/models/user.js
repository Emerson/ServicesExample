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
        assert(results[0]['email'] === 'jake@test.com')
        assert(results[1]['email'] === 'test@test.com')
        done()
      })
    })
  })

  it('creates a user', function(done) {
    var attributes = {email: 'create@create.com', first_name: 'Create', last_name: 'Test', password: 'ted123', password_confirmation: 'ted123'}
    Model.create(attributes, function(err, user) {
      assert(!err)
      assert(user, 'User was not passed')
      delete attributes.password
      delete attributes.password_confirmation
      _.each(attributes, function(val, key) {
        assert(user[key] === attributes[key])
      })
      done()
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

})