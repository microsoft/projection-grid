define([
  'jquery',
  'bluebird',
  'backbone',
  './index.jade',
], function ($, Promise, Backbone, template) {
  var PopupEditor = Backbone.View.extend({
    events: {
      'click .save': function () {
        this.trigger('save', this.value);
      },
      'click .cancel': function () {
        this.trigger('cancel');
      },
      'change .editor': function (e) {
        this.value = e.target.value;
      },
      'click form': function (e) {
        e.stopPropagation();
      }
    },

    initialize: function (options) {
      this.position = options.position;
      this.value = options.value;
      this.property = options.property;
    },

    render: function () {
      this.$el.html(template({ value: this.value }));
      this.$el.css({
        position: 'absolute',
        left: this.position.left,
        top: this.position.top,
      });
      return this;
    },
  });

  return PopupEditor;
});
