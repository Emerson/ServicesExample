var Password = require('../../lib/utils/password')
require('../helper')

describe('Password', function() {

  it('encrypts a password', function(done) {
    Password.encrypt('password123', function(err, encryptedPassword) {
      assert(!err)
      assert('password123' !== encryptedPassword)
      done()
    })
  })

  it('compares passwords', function(done) {
    Password.encrypt('password123', function(err, encryptedPassword) {
      Password.compare('password123', encryptedPassword, function(err, isPasswordMatch) {
        assert(!err)
        assert(isPasswordMatch)
        done()
      })
    })
  })

})