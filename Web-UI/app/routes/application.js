import Ember from 'ember';

export default Ember.Route.extend({

  loginError: null,

  _authenticate: function(credentials) {
    var _this = this;
    _this.set('loginError', null);
    var req = this.get('session').validateSession(credentials);
    req.then(function() {});
    req.catch(function() {
      _this.set('loginError', 'Invalid credentials');
    });
    return req;
  },

  actions: {

    authenticate: function(credentials) {
      this._authenticate(credentials);
    }

  }

});