define([
      'lib/underscore'
    , 'lib/backbone'
    , 'component/grid/model/index'
  ],
function(_, Backbone, Options){
  var Grid = Backbone.View.extend({
    // todo [akamel] document available options
    initialize: function(options) {
      options = options || {};

      this.options = new Options(options);

      // todo [akamel] assert that layout is a ctor
      this.layout = new options.layout({
          el      : this.el
        , grid    : this
      });

      this.projection = _.isFunction(options.projection)? new options.projection() : options.projection;

      this.projection.data.on('change', function(arg){
        this.trigger.apply(this, ['change:data'].concat(_.toArray(arguments)));
      }.bind(this));

      this.options.on('change', function(){
        this.trigger.apply(this, ['change:options'].concat(_.toArray(arguments)));
      }.bind(this));

      this.projection.on('all', function(){
        this.trigger.apply(this, ['data:' + _.first(arguments)].concat(_.rest(arguments)) );
      }.bind(this));

      this.layout.on('all', function(){
        var key = 'layout:' + _.first(arguments)
          , arg =  [key].concat(_.rest(arguments))
          ;

        this.projection.bubble.apply(this.projection, arg);
        this.trigger.apply(this, arg);
      }.bind(this));

      // todo [akamel] this is a temporary implementation of orderby; should be in layout not in grid
      this.on('layout:click:header', function(e, arg){
        var column = arg.column;

        if (column.sortable) {
          var orderby = {};

          var key = _.isString(column.sortable)? column.sortable : column.property;

          orderby[key] = column.$orderby? column.$orderby.dir * -1 : 1;

          this.projection.set({ 'orderby': [orderby], 'page.number': 0 });
        }
      }.bind(this));

      var local = _.omit(options, 'projection', 'layout');
      this.options.set(local);
    },

    set: function(key, value, options) {
      this.options.set.apply(this.options, _.toArray(arguments));
    },

    render: function(options) {
      var options = options || {};

      this.layout.render();

      if (options.fetch) {
        this.projection.update({ deep : true });
      }

      return this;
    }

  });

  return Grid;
});