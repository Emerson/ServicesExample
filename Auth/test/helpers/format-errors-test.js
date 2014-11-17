var formatErrors = require('../../lib/helpers/format-errors')


describe('Errors helper', function() {

  it('returns a formatted errors object from a sequelize validation object', function(done) {

    var mockErrors = [
      { message: 'You must provide a first name',
        type: 'Validation error',
        path: 'first_name',
        value: 'You must provide a first name',
        __raw: 'You must provide a first name' },
      { message: 'You must provide a last name',
        type: 'Validation error',
        path: 'last_name',
        value: 'You must provide a last name',
        __raw: 'You must provide a last name' }]

    var formattedErrors = formatErrors(mockErrors)
    assert(_.isArray(formattedErrors.first_name))
    assert(_.isArray(formattedErrors.last_name))
    assert(formattedErrors.first_name.length === 1)
    assert(formattedErrors.last_name.length === 1)
    done()

  })

})