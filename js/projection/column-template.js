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
        var columns = _.map(model.get('columns') || _.map(model.get('select'), function (i) {
          return { property: i };
        }), function (item) {
          var ret = _.clone(item);
          var property = ret.property;

          if (_.has(colTemplate, property)) {
            colTemplate = colTemplate[property];
            ret.$html = _.isFunction(colTemplate) ? colTemplate(ret) : colTemplate;
          }

          return ret;
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
