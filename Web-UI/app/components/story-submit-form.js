import Ember from 'ember';

export default Ember.Component.extend({

  story: null,

  actions: {

    submit: function() {
      var _this = this;
      var story = this.get('story');
      var req = story.save();
      req.then(function(story) {
        _this.sendAction('addStory', story);
      }, function() {});
    }

  }

});