import Ember from "ember";
import { test, moduleForComponent } from 'ember-qunit';

moduleForComponent('registration-form', 'Registration Form Component', {
  needs: ['component:error-message']
});

test('it renders properly', function() {
  var component = this.subject();
  // Render the component
  this.$();
  equal($('form').length, 1);
  equal($('form input').length, 6);
});

test('it triggers the showLogin action', function() {
  expect(1);
  var component = this.subject();
  var targetObject = {
    mockAction: function() {
      ok(true, 'called');
    }
  };
  component.set('showLogin', 'mockAction');
  component.set('targetObject', targetObject);
  // Render the component
  this.$();
  Ember.run(function() {
    $('a#showLogin').click();
  });
});
