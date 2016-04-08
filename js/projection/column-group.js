define([
  'lib/underscore',
  'lib/backbone',
  'component/grid/projection/base',
  'component/grid/schema/properties',
  'component/grid/model/response',
], function (_, Backbone, BaseProjection, schemaProperties /* , Response */) {
  var Model = BaseProjection.extend({
    defaults: {
      // todo [akamel] consider supporting a select on this level?
      map: _.identity,
    },
    name: 'column-group',
    update: function (options) {
      // Model.__super__.update.call(this, options);

      if (Model.__super__.update.call(this, options)) {
        var model = this.src.data;
        var columnGroup = this.get('column.group');
        var groupExpansion = this.get('column.groupExpansion') || [];
        var columns = model.get('columns');
        var select = model.get('select');

        _.each(columnGroup, function(subColumns, name) {
          columns[name].group = subColumns;
          var isExpand = columns[name].groupExpansion = _.contains(groupExpansion, name);
          if (_.contains(select, name) && isExpand) {
            var nameIndex = select.indexOf(name);
            select.splice.apply(select, [nameIndex, 1].concat(subColumns));
          }
        }, this);

        this.patch({
          columns: columns,
          select: select,
          'columns.groupExpansion': groupExpansion
        });
      } else {
        // todo [akamel] unset our properties only
        // this.unset();
      }
    },
  });

  return Model;
});
