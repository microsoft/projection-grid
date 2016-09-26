define([
  'lib/underscore',
  'lib/backbone',
  'component/grid/projection/base',
], function (_, Backbone, BaseProjection /* , schemaProperties, Response */) {
  const defaultPrefix = 'accessibility-';
  var Model = BaseProjection.extend({
    defaults: {
      'accessibility.rowcheck.idPrefix': defaultPrefix,
		},
		name: 'accessibility',
		update: function (options) {
      var accessibilityPre = this.get('accessibility.rowcheck.idPrefix');
      if (Model.__super__.update.call(this, options)) {
        this.patch({
          'accessibility.rowcheck.idPrefix': _.isString(accessibilityPre) ? accessibilityPre : defaultPrefix,
        });
      }
		}
  });
  return Model;
});
