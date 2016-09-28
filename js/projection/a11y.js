define([
  'lib/underscore',
  'lib/backbone',
  'component/grid/projection/base',
], function (_, Backbone, BaseProjection /* , schemaProperties, Response */) {
  const defaultselectAllLabel = 'Select All';
  var Model = BaseProjection.extend({
    defaults: {
      'a11y.selection.selectAllLabel': 'Select All'
    },
    name: 'a11y',
    update: function (options) {
      var selectAllLabel = this.get('a11y.selection.selectAllLabel');
      if (Model.__super__.update.call(this, options)) {
        this.patch({
          'a11y.selection.uniqueId': _.uniqueId().concat('-'),
          'a11y.selection.selectAllLabel': _.isString(selectAllLabel) ? selectAllLabel : defaultselectAllLabel,
        });
      }
    },
  });
  return Model;
});
