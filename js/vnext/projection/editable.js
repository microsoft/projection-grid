import _ from 'underscore';
import $ from 'jquery';
import editTemplate from '../layout/editable.jade';
import prompt from '../../popup-editor/index.js';

function deepClone(obj) {
  if (_.isArray(obj)) {
    return _.map(obj, deepClone);
  } else if (_.isObject(obj)) {
    return _.mapObject(obj, deepClone);
  }
  return obj;
}

function editInColumn(column) {
  return function (e) {
    const $td = $(e.target).closest('td');
    const key = this.keyOfElement(e.target);
    const item = this.itemWithKey(key);

    if($td.hasClass('grid-editable-cell')) {
      this.trigger('willEdit', item);

      const promptPos = {};
      const offset = $td.offset();
      if (offset.left > window.innerWidth * 0.9) {
        promptPos.right = document.body.clientWidth - offset.left;
      } else {
        promptPos.left = offset.left;
      }

      promptPos.top = offset.top;

      prompt({
        model: deepClone(item),
        position: promptPos,
        property: column.name,
        onSubmit: model => {
          this.trigger('didEdit', _.isEqual(model, item) ? null : model);
        },
        onCancel: model => {
          this.trigger('didEdit', null);
        },
      });
    }
  }
}
/**
* Enable editing and wrap each editable cell with a template
*
* @param {Object} state
* @param {ColumnGroup} [state.columnGroup] Column group information
* @param {Object} [state.bodyRows]
* @param {Number} [state.bodyRows.length] bodyRows' length
* @param {Function} [state.bodyRows.slice] Get bodyRows element
* @param {Object} [state.events] Backbone view events handler
* 
*/
export const editable = {
  name: 'editable',
  handler(state) {
    const leafColumns = state.columnGroup.leafColumns;
    const iconClasses = ['glyphicon', 'glyphicon-pencil'];
    const events = _.reduce(leafColumns, (memo, col) => {
      memo[`click td.grid-editable-cell.grid-column-${col.name}`] = editInColumn(col);
      return memo;
    }, {});
    const bodyRows = {
      length: state.bodyRows.length,
      slice: (...args) => state.bodyRows.slice(...args).map(row => {
        if (row.type !== 'data') {
          return row;
        }

        const cells = _.map(row.cells, (cell, index) => {
          const col = leafColumns[index];

          if (col.editable) {
            const classes = _.union(cell.classes, ['grid-editable-cell', `grid-column-${col.name}`]);
            const html = editTemplate({ $html: cell.html, classes: iconClasses });
            return _.defaults({ classes, html }, cell);
          }
          return cell;
        });
        return _.defaults({ cells }, row);
      }),
    };

    _.defaults(events, state.events);

    return _.defaults({ events, bodyRows }, state);
  },
  defaults: {},
};
