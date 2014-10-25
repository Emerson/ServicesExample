var _ = require('lodash')

module.exports = function(object) {
  var prependedObject = {}
  _.each(object, function(val, key) {
    prependedObject['$'+key] = val
  })
  return prependedObject;
}