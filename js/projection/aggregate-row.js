define([
  'lib/underscore',
  'lib/backbone',
  'component/grid/projection/base',
], function(_, Backbone, BaseProjection) {

  var createRows = function(fn, data) {
    var rows = fn(data);

    _.each(rows, function(row) {
      row.$metadata = _.extend(row.$metadata, { type: 'aggregate' });
    });

    return rows;
  };

  var Model = BaseProjection.extend({

    defaults: {
      'aggregate.top': null,
      'aggregate.bottom': null,
    },

    name: 'aggregate-row',

    update: function(options) {
      var value,
        topFn,
        rowTop,
        bottomFn,
        rowBottom;

      if (Model.__super__.update.call(this, options)) {
        value = this.src.data.get('value');

        if (value) {
          topFn = this.get('aggregate.top');
          bottomFn = this.get('aggregate.bottom');
          rowTop = _.isFunction(topFn) ? createRows(topFn, this.src.data) : null;
          rowBottom = _.isFunction(bottomFn) ? createRows(bottomFn, this.src.data) : null;

          if (rowTop) {
            value = _.flatten(rowTop).concat(value);
          }

          if (rowBottom) {
            value = value.concat(_.flatten(rowBottom));
          }

          this.patch({
            value: value,
          });
        }
      }
    },

  });

  return Model;
});
