define([
  'lib/underscore',
  'lib/backbone',
  'component/grid/projection/base',
  'component/grid/schema/properties',
  'component/grid/model/response',
], function (_, Backbone, BaseProjection /* , schemaProperties, Response */) {
  var Model = BaseProjection.extend({
    defaults: {
      'column.i18n': {
        '': function (name) {
          return name;
        },
      },
    },
    name: 'column-i18n',
    beforeSet: function (local) {
      if (_.has(local, 'column.i18n')) {
        if (!_.isObject(local['column.i18n'])) {
          local['column.i18n'] = this.defaults['column.i18n'];
        }
      }
    },
    update: function (options) {
      // todo [akamel] when calling a deep update; suppress onchange event based updates
      // Model.__super__.update.call(this, options);

      if (Model.__super__.update.call(this, options)) {
        var model = this.src.data;
        var colOptions = this.get('column.i18n');
        var columns = model.get('columns') || {};
        var select = model.get('select') || _.keys(columns);
        var $default = colOptions[''];

        var i18nColumns = {};
        _.each(select, function (element) {
          var opt = colOptions[element];
          if (_.isUndefined(opt)) {
            opt = $default;
          }

          i18nColumns[element] = _.defaults({
            $text: _.isFunction(opt) ? opt(element) : opt,
            property: element,
          }, columns[element]);
        });

        this.patch({
          columns: i18nColumns,
        });
      } else {
        // todo [akamel] unset our properties only
        // this.unset();
      }
    },
  });

  return Model;
});
