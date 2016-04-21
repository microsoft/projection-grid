define([
  'jquery',
  'bluebird',
  'backbone',
  './index.jade',
], function ($, Promise, Backbone, template) {
  var PopupEditor = Backbone.View.extend({
    events: {
      'click .save': function () {
        this.trigger('save', this.model);
      },
      'click .cancel': function () {
        this.trigger('cancel');
      },
      'change .editor': function (e) {
        this.model[this.property] = e.target.value;
      },
    },

    initialize: function (options) {
      this.position = options.position;
      this.model = options.model;
      this.property = options.fields[0].property;
    },

    render: function () {
      this.$el.html(template({ value: this.model[this.property] }));
      this.$el.css({
        position: 'absolute',
        left: this.position.left,
        top: this.position.top,
      });
      this.dismiss = function () {
        this.trigger('cancel');
      }.bind(this);

      window.setTimeout(function () {
        $(window).on('click', this.dismiss);
      }, 0);
      return this;
    },

    remove: function () {
      $(window).off('click', this.dismiss);
      Backbone.View.prototype.remove.apply(this, arguments);
    },
  });

  return {
    prompt: function (options) {
      return new Promise(function (resolve /* , reject */) {
        var editor = new PopupEditor(options);

        document.body.appendChild(editor.render().el);

        editor.on('save', function (model) {
          resolve(model);
          editor.remove();
        });

        editor.on('cancel', function () {
          resolve();
          editor.remove();
        });
      });
    },
  };
});
