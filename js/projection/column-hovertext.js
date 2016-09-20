define([
  'lib/underscore',
  'lib/backbone',
  'component/grid/projection/base',
], function (_, Backbone, BaseProjection) {
  var Model = BaseProjection.extend({
    name: 'column-hovertext',
    update: function (options) {
      if (Model.__super__.update.call(this, options)) {
        var model = this.src.data;
        var columns = model.get('columns');

        _.each(columns, function(column) {
          _.extend(column, {
            $metadata: {
              'attr.head': {
                title: _.result(column.config, 'hoverText') || _.result(column.config, 'title') || '',
              },
            },
          });
        });

        this.patch({ columns: columns });
      }
    },
  });

  return Model;
});
