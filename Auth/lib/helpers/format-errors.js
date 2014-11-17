module.exports = function(errors) {

  var formattedErrors = {}

  _.forEach(errors, function(error) {
    if(!_.isArray(formattedErrors[error.path])) {
      formattedErrors[error.path] = [];
    }
    formattedErrors[error.path].push(error.message)
  })

  return formattedErrors

}