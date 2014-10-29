import Ember from 'ember';

export default Ember.Component.extend({

  email: '',
  password: '',
  errors: null,

  actions: {

    submit: function() {
      this.sendAction('login', {email: this.get('email'), password: this.get('password')});
    }

  }

});