import Ember from 'ember';

export default Ember.Component.extend({

  email: '',
  password: '',

  init: function() {
    console.log(this.toString());
    //=> Returns <web-ui@component:login-form::ember335>
  },

  actions: {

    submit: function() {
      this.sendAction('login', {email: this.get('email'), password: this.get('password')});
    }

  }

});