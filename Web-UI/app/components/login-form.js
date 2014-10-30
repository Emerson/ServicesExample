import Ember from 'ember';

export default Ember.Component.extend({

  email: '',
  password: '',
  error: null,

  actions: {

    showRegistration: function() {
      this.sendAction('showRegistration');
    },

    submit: function() {
      this.sendAction('login', {email: this.get('email'), password: this.get('password')});
    }

  }

});