define([
  'lib/underscore',
  'lib/backbone',
  'component/grid/projection/base',
  'component/grid/schema/properties',
  'component/grid/model/response',
], function (_, Backbone, BaseProjection, schemaProperties /* , Response */) {
  var Model = BaseProjection.extend({
    defaults: {
      skip: 0,
      take: Number.MAX_VALUE,
      select: [],
    },
    name: 'memory-page',
    update: function (options) {
      if (Model.__super__.update.call(this, options)) {
        var model = this.src.data;

        var value = model.get('value');

        value = _.chain(value)
                  .rest(this.get('skip'))
                  .first(this.get('take'))
                  .value();

        var select = this.get('select');
        if (!_.size(select)) {
          select = schemaProperties.from(value);
        }

        this.patch({
          value: value,
          select: select,
        });
      }
    },
  });

  return Model;
});
