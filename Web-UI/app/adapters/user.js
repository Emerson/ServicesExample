import Ember from 'ember';
import DS from "ember-data";

export default DS.ActiveModelAdapter.extend({
  host: Ember.ENV.usersEndpoint
});