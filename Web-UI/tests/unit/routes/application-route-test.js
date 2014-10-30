import { test, moduleFor } from 'ember-qunit';
import mockRequests from '../../helpers/mockRequests';
import SessionManager from 'web-ui/services/session';

moduleFor('route:application', "Unit - ApplicationRoute", {
  needs: ['service:session']
});

test('it exists', function() {
  ok(this.subject());
});

test('it sets triggers the session.validateSession method', function() {
  expect(1);
  var route = this.subject();
  var mockObject = {
    called: false,
    validateSession: function() { this.called = true; }
  };
  route.set('session', mockObject);
  route._authenticate({});
  ok(mockObject.called);
});