var Password = require('../../lib/utils/password')
require('../helper')

describe('Password', function() {

  it('encrypts a password', function(done) {
    Password.encrypt('ted123', function(err, encryptedPassword) {
      assert(!err)
      assert('ted123' !== encryptedPassword)
      done()
    })
  })

  it('compares passwords', function(done) {
    Password.encrypt('ted123', function(err, encryptedPassword) {
      Password.compare('ted123', encryptedPassword, function(err, isPasswordMatch) {
        assert(!err)
        assert(isPasswordMatch)
        done()
      })
    })
  })

})