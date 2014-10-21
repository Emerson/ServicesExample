var prependKeys = require('../../lib/utils/prepend_keys')
require('../helper')

describe('Prepend Keys', function() {

  it('prepends keys', function() {
    var example = {one: 'one', two: 'two', three: 'three'}
    prependedExample = prependKeys(example)
    _.each(example, function(val, key) {
      assert(prependedExample['$'+key] === example[key])
    })
  })

})