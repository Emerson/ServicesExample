import Ember from "ember";
import { test, moduleForComponent } from 'ember-qunit';

moduleForComponent('error-message');

test('it renders errors', function() {
  expect(1);
  var component = this.subject();
  // Render the component
  this.$();
  Ember.run(function() {
    component.set('error', [{message: 'This is an error'}]);

  });
  equal(this.$('.help-text').text().trim(), 'This is an error');
});