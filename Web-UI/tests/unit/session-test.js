import {test} from 'ember-qunit';
import Session from '../../services/session';
import mockRequests from '../helpers/mockRequests';
import Ember from 'ember';
var SessionManager;

module('Session Service', {
  setup: function() {
    $.mockjax.clear();
    SessionManager = Session.create();
    SessionManager.store = {
      push: function(type, attributes) {
        this.attributes = attributes;
        var mockUser = Ember.Object.create(attributes);
        mockUser.attributes = attributes;
        mockUser.serialize = function() { return this.attributes; };
        return mockUser;
      }
    };
  },
  teardown: function() {
    SessionManager.set('authToken', null);
  }
});

test("it exists", function() {
  ok(SessionManager);
});

test("it should be logged out by default", function() {
  ok(!SessionManager.get('loggedIn'));
});

test("it should reject a user with an invalid email or password and set an error", function() {
  mockRequests.authFailure();
  return SessionManager.validateSession({})
    .catch(function(error) {
      equal(error.authenticated, false);
      equal(SessionManager.get('authToken'), null);
      equal(SessionManager.get('loginError'), true);
      ok(!SessionManager.get('loggedIn'));
    });
});

test("it should login a user with an email and password", function() {
  mockRequests.authSuccess();
  return SessionManager.validateSession({email: 'test@test.com', password: 'ted123'})
    .then(function(res) {
      ok(res.user.email);
      ok(res.user.first_name);
      ok(res.user.last_name);
      ok(res.user.auth_token);
      equal(SessionManager.get('authToken'), res.user.auth_token);
      ok(SessionManager.get('loggedIn'));
    });
});

test("it should logout a user", function() {
  mockRequests.logoutSuccess('xxxxxx');
  SessionManager.set('authToken', 'xxxxxx');
  ok(SessionManager.get('loggedIn'));
  return SessionManager.invalidateSession()
    .then(function(res) {
      ok(res.logged_out);
      ok(!SessionManager.get('loggedIn'));
    });
});

test("it should autologin users", function() {
  var mockAttributes = {email: 'test@test.com', first_name: 'test', last_name: 'test', auth_token: 'xxxxxx', authToken: 'xxxxxx'};
  var mockUser = Ember.Object.create(mockAttributes);
  mockUser.attributes = mockAttributes;
  mockUser.serialize = function() { return this.attributes; };
  SessionManager.autologin(mockUser);
  ok(SessionManager.get('currentUser'));
  equal(SessionManager.get('currentUser.email'), 'test@test.com');
  ok(SessionManager.get('loggedIn'));
  equal(SessionManager.get('authToken'), 'xxxxxx');
});