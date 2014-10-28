import Ember from "ember";
import { test } from 'ember-qunit';
import startApp from '../../helpers/start-app';
var App;
 
module('Route - Home', {
 setup: function() {
   App = startApp();
 },
 teardown: function() {
   Ember.run(App, App.destroy);
 }
});
 
test("Page renders properly", function() {
 expect(1);
 visit('/').then(function() {
   equal(find('h2:contains("Stories")').length, 1, "Page header was rendered");
 });
});
