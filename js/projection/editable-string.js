/**
 *
 * Important!!!
 *
 * The initial check-in is for unblock the simple grid in advanced campaign creation and
 * may cause bugs if you try to use it with some more complex grid. Please DO NOT use this
 * projection until we update this and remove the comments here.
 *
 * todo [yucongj, wewei] add the model to maintail the input data.
 *
 */

define([
      'lib/underscore'
    , 'lib/jquery'
    , 'component/grid/projection/base'
    , 'component/grid/layout/template/row.editable.string'
  ],
function(_, jquery, BaseProjection, editableTemplate){
  'use strict';

  var Model = BaseProjection.extend({
    defaults : {
      'column.editable.string' : {}
    },
    name : 'column-editable-string',
    update : function(options) {
      if (Model.__super__.update.call(this, options)) {
        var model        = this.src.data
        , columnEditable = this.get('column.editable.string')
        , value          = _.map(model.get('value'), function(item){
          var ret          = _.clone(item);

          _.each(columnEditable, function(value, key) {
            if (_.has(ret, key)) {
              if (!_.isObject(ret[key])) {
                var obj = new Object(ret[key]);

                if (_.isUndefined(ret[key])) {
                  obj.$undefined = true;
                }

                if (_.isNull(ret[key])) {
                  obj.$null = true;
                }

                ret[key] = obj;
              }

              var defaultValue = (ret[key].$undefined || ret[key].$null) ? value.defaultValue : ret[key];

              ret[key].$html = editableTemplate({defaultValue : defaultValue});
            }
          });

          return ret;
        });

        this.patch({
            value : value
        });
      }
    }
  });

  return Model;
});