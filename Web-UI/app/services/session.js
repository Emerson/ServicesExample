/* global _ */
/* global $ */

import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Object.extend({

  authToken: null,
  loginError: null,
  currentUser:  null,

  invalidateSession: function() {
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve) {
      var req = ajax({
        url: Ember.ENV.authenticationUrl + '/' + _this.get('authToken'),
        type: 'DELETE'
      });
      _this.set('authToken', null);
      _this.set('currentUser', null);
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
        var camelizedAttributes = {};
        Ember.keys(res.user).forEach(function(key) {
          camelizedAttributes[key.camelize()] = res.user[key];
        });
        var user = _this.store.push('user', camelizedAttributes);
        _this.autologin(user);
        resolve(res);
      });
      req.catch(function(res) {
        _this.set('authToken', null);
        _this.set('loginError', true);
        reject(res.jqXHR.responseJSON);
      });
    });
  },

  autologin: function(user) {
    this.set('loginError', null);
    this.set('authToken', user.get('authToken'));
    this.set('currentUser', user);
    return true;
  },

  loggedIn: function() {
    this.get('authToken');
    if(this.get('authToken')) {
      return true;
    }else{
      return false;
    }
  }.property('authToken', 'currentUser'),

  addPrefilter: function() {
    var _this = this;
    if(this.get('loggedIn')) {
      $.ajaxPrefilter(function(options, originalOptions, xhr) {
        return xhr.setRequestHeader('Authorization', _this.get('authToken'));
      });
    }
  }.observes('loggedIn').on('init')

});