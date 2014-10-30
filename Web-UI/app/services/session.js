/* global _ */

import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Object.extend({

  authToken: null,
  loginError: null,

  invalidateSession: function() {
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve) {
      var req = ajax({
        url: Ember.ENV.authenticationUrl + '/' + _this.get('authToken'),
        type: 'DELETE'
      });
      _this.set('authToken', null);
      req.then(function(res) {
        resolve(res);
      });
      req.catch(function(res) {
        resolve(res);
      });
    });
  },

  validateSession: function(credentials) {
    var _this = this;
    _this.set('loginError', null);
    credentials = _.defaults(credentials, {email: '', password: ''});
    return new Ember.RSVP.Promise(function(resolve, reject) {
      var req = ajax({
        url: Ember.ENV.authenticationUrl,
        type: 'POST',
        data: credentials
      });
      req.then(function(res) {
        _this.set('authToken', res.user.auth_token);
        resolve(res);
      });
      req.catch(function(res) {
        _this.set('authToken', null);
        _this.set('loginError', true);
        reject(res.jqXHR.responseJSON);
      });
    });
  },

  autologin: function(token) {
    this.set('loginError', null);
    this.set('authToken', token);
    return true;
  },

  loggedIn: function() {
    if(this.get('authToken')) {
      return true;
    }else{
      return false;
    }
  }.property('authToken')

});