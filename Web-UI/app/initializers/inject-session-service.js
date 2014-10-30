import SessionManager from 'web-ui/services/session';

export default {
  name: 'inject-session-manager',
  after: 'store',
  initialize: function(container, app) {
    app.register('service:session', SessionManager, {singleton: true});
    app.inject('route', 'session', 'service:session');
    app.inject('controller', 'session', 'service:session');
    app.inject('service:session', 'store', 'store:main');
  }
};