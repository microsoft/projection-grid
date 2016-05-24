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

      this.dismiss = function () {
        this.trigger('cancel');
      }.bind(this);

      window.setTimeout(() => {
        $(window).on('click', this.dismiss);
      }, 0);

      return this;
    },

    remove: function () {
      $(window).off('click', this.dismiss);
      Backbone.View.prototype.remove.apply(this, arguments);
    },

  });

  return function (options) {
    var editor = new PopupEditor(options);

    document.body.appendChild(editor.render().el);

    editor.on('save', function (value) {
      editor.remove();
      options.onSubmit && options.onSubmit(value);
    });

    editor.on('cancel', function () {
      editor.remove();
      options.onCancel && options.onCancel();
    });
  };
});
