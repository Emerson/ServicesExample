import SessionManager from 'web-ui/services/session';

export default {
  name: 'inject-session-manager',
  initialize: function(container, app) {
    app.register('service:session', SessionManager, {singleton: true});
    app.inject('route', 'session', 'service:session');
    app.inject('controller', 'session', 'service:session');
  }
};