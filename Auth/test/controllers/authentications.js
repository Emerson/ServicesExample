require('../helper')
var request = require('supertest')
var Model = require('../../lib/models/user')
var app

describe('Authentications Controller', function() {

  beforeEach(function() {
    app = setupApp()
  })
  beforeEach(rebuildDb)
  beforeEach(function(done) {
    seedUsers({}, done)
  })

  it('POST /api/v1/users/authenticate - authenticates a user', function(done) {
    request(app)
      .post('/api/v1/users/authenticate')
      .send({email: 'test@test.com', password: 'ted123'})
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        assert(!err)
        assert(res.body.user.email)
        assert(res.body.user.first_name)
        assert(res.body.user.last_name)
        assert(res.body.user.auth_token)
        done()
      })
  })

  it('GET /api/v1/users/authenticate/:token - authenticates with a token', function(done) {
    request(app)
      .get('/api/v1/users/authenticate/xxxxxx')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        assert(!err)
        assert(res.body.authenticated)
        done()
      })
  })

  it('DEL /api/v1/users/authenticate/:token - logs out the user', function(done) {
    request(app)
      .del('/api/v1/users/authenticate/xxxxxx')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        assert(!err)
        assert(res.body.logged_out)
        done()
      })
  })

  //-- Invalid Requests ---------------------------------------------------
  it('Invalid GET /api/v1/users/authenticate/:token - returns an error', function(done) {
    request(app)
      .get('/api/v1/users/authenticate/invalid-token')
      .expect('Content-Type', /json/)
      .expect(401)
      .end(function(err, res) {
        assert(!res.body.authenticate)
        done()
      })
  })



})