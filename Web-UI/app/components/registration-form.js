import Ember from 'ember';

export default Ember.Component.extend({

  user: null,

  actions: {

    showLogin: function() {
      this.sendAction('showLogin');
    },

    submit: function() {
      var _this = this;
      var user = this.get('user');
      var req = user.save();
      req.then(function(user) {
        _this.get('session').autologin(user.get('authToken'));
      }, function() {});
    }

  }

});