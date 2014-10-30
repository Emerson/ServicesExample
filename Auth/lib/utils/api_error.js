module.exports = {

  notFound: function(res, errors) {
    res.status(404)
    res.json(errors)
    res.end()
  },

  unprocessableEntity: function(res, errors) {
    res.status(422)
    res.json({errors: errors});
  },

  unauthorized: function(res, errors) {
    res.status(401)
    res.json(errors)
  }

}
