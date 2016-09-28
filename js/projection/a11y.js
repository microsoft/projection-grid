define([
  'lib/underscore',
  'lib/backbone',
  'component/grid/projection/base',
], function (_, Backbone, BaseProjection /* , schemaProperties, Response */) {
  const defaultPrefix = 'a11y-';
  var Model = BaseProjection.extend({
    defaults: {
      'a11y.rowcheck.idPrefix': defaultPrefix,
      'a11y.rowcheck.checkAllI18n': 'Check all'
    },
    name: 'a11y',
    update: function (options) {
      var a11yPrefix = this.get('a11y.rowcheck.idPrefix');
      var checkAllI18n = this.get('a11y.rowcheck.checkAlli18n');
      if (Model.__super__.update.call(this, options)) {
        this.patch({
          'a11y.enabled': true,
          'a11y.rowcheck.idPrefix': _.isString(a11yPrefix) ? a11yPrefix : defaultPrefix,
          'a11y.rowcheck.checkAllI18n': checkAllI18n,
        });
      }
    },
  });
  return Model;
});
