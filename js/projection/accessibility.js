define([
  'lib/underscore',
  'lib/backbone',
  'component/grid/projection/base',
], function (_, Backbone, BaseProjection /* , schemaProperties, Response */) {
  var Model = BaseProjection.extend({
    defaults: {
			'accessibility.rowcheck.idPrefix': 'accessibility-',
		},
		name: 'accessibility',
		update: function (options) {
      if (Model.__super__.update.call(this, options)) {
        this.patch({
          'accessibility.rowcheck.idPrefix': this.get('accessibility.rowcheck.idPrefix'),
        });
      }
		}
  });
  return Model;
});
