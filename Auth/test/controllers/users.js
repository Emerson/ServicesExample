require('../helper')
var request = require('supertest')
var app

describe('Users Controller', function() {

  beforeEach(function() {
    app = setupApp()
  })

  it('responds to /api/v1/users', function(done) {
    request(app)
      .get('/api/v1/users')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        assert(!err)
        assert(res.body.users)
        assert(res.body.users[0].email)
        assert(res.body.users[0].first_name)
        assert(res.body.users[0].last_name)
        assert(res.body.users[0].auth_token)
        done()
      })
  })

  it('responds to /users/:id', function(done) {
    request(app)
      .get('/api/v1/users/1')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        assert(!err)
        assert(res.body.user)
        assert(res.body.user.email)
        assert(res.body.user.first_name)
        assert(res.body.user.last_name)
        assert(res.body.user.auth_token)
        done()
      })
  })

  it('deletes users with delete requests to /users/:id', function(done) {
    done()
  })

  it('creates users with post requests to /users', function(done) {
    done()
  })

})