import Ember from "ember";
import { test, moduleForComponent } from 'ember-qunit';

moduleForComponent('login-form');

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