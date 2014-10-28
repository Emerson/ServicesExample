/* global mockjax */
/* global Ember */

export default {

  authSuccess: function() {
    $.mockjax({
      url: Ember.ENV.authenticationUrl,
      responseTime: 10,
      responseText: {
        user: {email: 'test@test.com', first_name: 'first', last_name: 'last', auth_token: 'xxxxxx'}
      }
    });
  },

  authFailure: function() {
    $.mockjax({
      url: Ember.ENV.authenticationUrl,
      responseTime: 10,
      status: 401,
      responseText: {authenticated: false}
    });
  },

  logoutSuccess: function(token) {
    $.mockjax({
      url: Ember.ENV.authenticationUrl + '/' + token,
      responseTime: 10,
      status: 200,
      responseText: {logged_out: true}
    });
  }

};