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
        this.get('session').autologin(res.user.auth_token);
        debugger;
        console.log(res, 'then');
      }, function() {});
    }

  }

});