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
        var select = _.size(model.get('columns')) ? _.map(model.get('columns'), function (i) {
          return i.property;
        }) : model.get('select');
        var lookup = {};
        var $default = colOptions[''];

        // todo [akamel] use indexBy from underscore 1.5.x
        _.each(model.get('columns'), function (element) {
          lookup[element.property] = element;
        });

        var i18nColumns = _.map(select, function (element) {
          var opt = colOptions[element];
          if (_.isUndefined(opt)) {
            opt = $default;
          }

          return _.defaults({
            $text: _.isFunction(opt) ? opt(element) : opt,
            property: element,
          }, lookup[element]);
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
