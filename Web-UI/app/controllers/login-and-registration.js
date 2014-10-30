import Ember from 'ember';

export default Ember.Controller.extend({

  init: function() {
    this.set('user', this.store.createRecord('user'));
    this._super();
  },

  showLogin: true,

  actions: {

    showLogin: function() {
      this.set('showLogin', true);
    },

    showRegistration: function() {
      this.set('showLogin', false);
    }

  }

});