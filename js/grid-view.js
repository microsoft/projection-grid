define([
  'lib/underscore',
  'lib/backbone',
  'component/grid/model/index',
  'component/grid/windowContainer',
  'component/grid/elementContainer',
], function (_, Backbone, Options, WindowContainer, ElementContainer) {
  var GridView = Backbone.View.extend({
    // todo [akamel] document available options
    initialize: function (options) {
      options = options || {};

      this.options = new Options(options);

      var container = selectContainer(options.container);

      // todo [akamel] assert that layout is a ctor
      this.layout = new options.Layout({
        el: this.el,
        grid: this,
        container: container,
      });

      this.projection = options.projection;

      this.projection.data.on('change', function () {
        this.trigger.apply(this, ['change:data'].concat(_.toArray(arguments)));
      }.bind(this));

      this.options.on('change', function () {
        this.trigger.apply(this, ['change:options'].concat(_.toArray(arguments)));
      }.bind(this));

      this.projection.on('all', function () {
        this.trigger.apply(this, ['data:' + _.first(arguments)].concat(_.rest(arguments)));
      }.bind(this));

      this.layout.on('all', function () {
        var key = 'layout:' + _.first(arguments);
        var arg = [key].concat(_.rest(arguments));

        this.projection.bubble.apply(this.projection, arg);
        this.trigger.apply(this, arg);
      }.bind(this));

      // todo [akamel] this is a temporary implementation of orderby; should be in layout not in grid
      this.on('layout:click:header', function (e, arg) {
        var column = arg.column;

        if (column.sortable) {
          var orderby = {};

          var key = _.isString(column.sortable) ? column.sortable : column.property;

          orderby[key] = column.$orderby ? column.$orderby.dir * -1 : 1;

          this.projection.set({ 'orderby': [orderby], 'page.number': 0 });
        }
      }.bind(this));

      var local = _.omit(options, 'projection', 'layout');
      this.options.set(local);
    },

    remove: function () {
      this.layout.remove();
      Backbone.View.prototype.remove.apply(this, arguments);
    },

    set: function () {
      this.options.set.apply(this.options, _.toArray(arguments));
    },

    render: function (options) {
      options = options || {};

      this.layout.render();

      if (options.fetch) {
        this.projection.update({ deep: true });
      }

      return this;
    },

    getSelection: function () {
      return this.projection.get('row.check.list') || [];
    },

  });

  function selectContainer(userContainer) {
    if (userContainer && window !== userContainer && ElementContainer.isValidContainer(userContainer)) {
      return new ElementContainer({ el: userContainer });
    }

    return new WindowContainer();
  }

  return GridView;
});
