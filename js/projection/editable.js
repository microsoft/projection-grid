define([
  'lib/underscore',
  'lib/jquery',
  'component/grid/projection/base',
  'component/grid/layout/template/editable',
  'component/popup-editor/index',
], function (_, $, BaseProjection, editableTemplate, PopupEditor) {
  'use strict';

  function isReadonlyRow(item) {
    return !item || (item.$metadata && _.contains([
      'aggregate',
      'segmentation',
    ], item.$metadata.type));
  }

  return BaseProjection.extend({
    defaults: {
      'column.editable': [],
    },
    name: 'column-editable',
    events: {
      'layout:click:cell': 'tdClick',
    },

    beforeSet: function (local) {
      var editable = function () {
        return true;
      };
      var conditions = _.reduce(local['column.editable'], function (conds, editableColumn) {
        if (_.isString(editableColumn)) {
          conds[editableColumn] = editable;
        } else if (_.isObject(editableColumn) && _.isString(editableColumn.name)) {
          conds[editableColumn.name] = _.isFunction(editableColumn.condition) ? editableColumn.condition : editable;
        }
        return conds;
      }, {});

      this.isEditable = function (key, item) {
        return _.isFunction(conditions[key]) && conditions[key](item);
      };
    },

    update: function (options) {
      if (BaseProjection.prototype.update.call(this, options)) {
        var model = this.src.data;
        var columns = model.get('columns');
        var columnIndex = _.mapObject(_.groupBy(columns, 'property'), _.first);
        var iconClasses = this.get('editable.icon.class') || ['glyphicon', 'glyphicon-pencil'];

        _.each(this.get('column.editable'), function (editableColumn) {
          var key = _.isString(editableColumn) ? editableColumn : editableColumn.name;
          if (key) {
            var column = columnIndex[key] || { property: key };
            var $metadata = column.$metadata = column.$metadata || {};
            var attrBody = $metadata['attr.body'] = $metadata['attr.body'] || {};
            var className = attrBody.class || [];

            if (_.isString(className)) {
              className = className.split(/\s+/);
            }
            attrBody.class = _.union(className, ['grid-editable-cell']);

            if (!columnIndex[key]) {
              columns.push(column);
            }
          }
        });

        var value = _.map(model.get('value'), function (item) {
          return isReadonlyRow(item) ? item : _.mapObject(item, function (value, key) {
            if (this.isEditable(key, item)) {
              if (!_.isObject(value)) {
                value = new Object(value); // eslint-disable-line
              }

              value.$html = editableTemplate({
                $html: value.$html || String(value),
                classes: iconClasses,
              });
            }
            return value;
          }, this);
        }, this);

        this.patch({ value: value });
      }
    },

    tdClick: function (e, arg) {
      var schema = null;

      if (!isReadonlyRow(arg.model) && this.isEditable(arg.property, arg.model) && e.target.tagName !== 'A') {
        schema = arg.grid.options.get('schema');
        PopupEditor.prompt({
          template: 'inline',
          model: _.clone(arg.model),
          schema: schema,
          fields: [{
            showLabel: false,
            property: arg.property,
          }],
          position: $(e.target).closest('td').position(),
        }).then(function (model) {
          if (model) {
            this.trigger('edit', model);
          }
        }.bind(this));
      }
    },
  });
});
