define([
  'lib/underscore',
  'component/grid/projection/base',
], function (_, BaseProjection) {
  'use strict';

  var Model = BaseProjection.extend({
    defaults: {
      'column.template': {},
    },
    name: 'column-template',
    update: function (options) {
      // todo [akamel] when calling a deep update; suppress onchange event based updates
      // Model.__super__.update.call(this, options);

      // TODO [imang]: columns: ideally we should not need to read from select.
      if (Model.__super__.update.call(this, options)) {
        var model = this.src.data;
        var colTemplate = this.get('column.template');
        var columns = model.get('columns');
        _.each(columns, function (item, property) {
          var ret = _.clone(item);
          var templateValue = colTemplate[property];

          if (_.has(colTemplate, property)) {
            ret.$html = _.isFunction(templateValue) ? templateValue(ret) : templateValue;
          }

          columns[property] = ret;
        });

        this.patch({ columns: columns });
      } else {
        // todo [akamel] unset our properties only
        // this.unset();
      }
    },
  });

  return Model;
});
