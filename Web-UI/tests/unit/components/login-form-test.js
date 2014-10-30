import Ember from "ember";
import { test, moduleForComponent } from 'ember-qunit';

moduleForComponent('login-form', 'Login Form Component');

test('it renders properly', function() {
  var component = this.subject();
  // Render the component
  this.$();
  equal($('form').length, 1);
  equal($('input#email').length, 1);
  equal($('input#password').length, 1);
});

test('binds email and password', function() {
  var component = this.subject();
  // Render the component
  this.$();
  Ember.run(function() {
    $('input#email').val('test@test.com').trigger('change');
    $('input#password').val('ted123').trigger('change');
  });
  equal(component.get('email'), 'test@test.com');
  equal(component.get('password'), 'ted123');
});

test('it triggers a submit action and passes an email and password', function() {
  expect(3);
  var component = this.subject();
  var targetObject = {
    mockAction: function(credentials) {
      ok(credentials.email);
      ok(credentials.password);
      ok(true, 'mock action action was called');
    }
  };
  component.set('login', 'mockAction');
  component.set('targetObject', targetObject);
  // Render the component
  this.$();

  Ember.run(function() {
    $('input#email').val('test@test.com').trigger('change');
    $('input#password').val('ted123').trigger('change');
    $('input[type="submit"]').trigger('click');
  });
});

test('it triggers the showRegistration action', function() {
  expect(1);
  var component = this.subject();
  var targetObject = {
    mockAction: function() {
      ok(true, 'called');
    }
  };
  component.set('showRegistration', 'mockAction');
  component.set('targetObject', targetObject);
  // Render the component
  this.$();
  Ember.run(function() {
    $('a#showRegistration').click();
  });
});

test('it displays an error message', function() {
  expect(1);
  var component = this.subject();
  // Render the component
  this.$();
  Ember.run(function() {
    component.set('error', true);
  });
  equal($('.alert-warning').length, 1);
});