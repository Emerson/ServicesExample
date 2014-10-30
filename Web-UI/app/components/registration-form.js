import Ember from 'ember';

export default Ember.Component.extend({

  user: null,

  actions: {

    showLogin: function() {
      this.sendAction('showLogin');
    },

    submit: function() {
      var user = this.get('user');
      var req = user.save();
      req.then(function(res) {
        console.log(res, 'then');
      }, function() {});
    }

  }

});