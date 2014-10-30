import Ember from "ember";
import { test } from 'ember-qunit';
import startApp from '../../helpers/start-app';
import mockRequests from '../../helpers/mockRequests';
var App;
 
module('Route - Home', {
 setup: function() {
   App = startApp();
   mockRequests.mockStories();
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
