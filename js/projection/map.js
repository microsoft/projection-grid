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
    name: 'map',
    update: function (options) {
      // Model.__super__.update.call(this, options);

      if (Model.__super__.update.call(this, options)) {
        var model = this.src.data;
        var map = this.get('map');
        var value = _.isFunction(map) ? _.map(model.get('value'), map) : model.get('value');

        value = _.flatten(value);

        this.patch({
          value: value,
          select: _.without(schemaProperties.from(value), '$metadata')
        });
      } else {
        // todo [akamel] unset our properties only
        // this.unset();
      }
    },
  });

  return Model;
});
