import Ember from 'ember';

export default Ember.Route.extend({

  model: function() {
    return Ember.RSVP.hash({
      story: this.store.createRecord('story')
    });
  },

  _authenticate: function(credentials) {
    var req = this.get('session').validateSession(credentials);
    return req;
  },

  _logout: function() {
    var req = this.get('session').invalidateSession();
    return req;
  },

  actions: {

    authenticate: function(credentials) {
      this._authenticate(credentials);
    },

    logout: function() {
      this._logout();
    }

  }

});