import { test, moduleFor } from 'ember-qunit';
import mockRequests from '../../helpers/mockRequests';
import SessionManager from 'web-ui/services/session';

moduleFor('route:application', "Unit - ApplicationRoute", {
  needs: ['service:session']
});

test('it exists', function() {
  ok(this.subject());
});

test('it sets the loginError property on a login failure', function() {
  expect(1);
  mockRequests.authFailure();
  var route = this.subject();
  route.set('session', SessionManager.create());
  route._authenticate({}).catch(function() {
    ok(route.get('loginError'));
  });
});