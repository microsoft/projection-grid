define([
  'lib/underscore',
  'lib/backbone',
  'component/grid/projection/base',
  'component/grid/schema/properties',
  'component/grid/model/response',
], function (_, Backbone, BaseProjection /* , schemaProperties, Response */) {
  var Model = BaseProjection.extend({
    defaults: {
			'accessibility.row.check.idPrefix': 'accessibility__',
		},
		name: 'accessibility',
		update: function (options) {
		}
  }),
});