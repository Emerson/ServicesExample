import Ember from 'ember';

export default Ember.Route.extend({

  _authenticate: function(credentials) {
    var req = this.get('session').validateSession(credentials);
    return req;
  },

  actions: {

    authenticate: function(credentials) {
      this._authenticate(credentials);
    }

  }

});