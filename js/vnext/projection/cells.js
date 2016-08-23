import _ from 'underscore';
import { normalizeClass } from './common.js';

function translateRow(columnGroup, row, rowType, index) {
  const patch = {};

  if (_.has(row, 'html')) {
    patch.cells = [{
      attributes: {
        rowspan: 1,
        colspan: columnGroup.width,
      },
      html: row.html,
    }];
  }
  if (_.has(row, 'view')) {
    patch.cells = [{
      attributes: {
        rowspan: 1,
        colspan: columnGroup.width,
      },
      view: row.view,
    }];
  }
  if (_.has(row, 'item')) {
    patch.cells = _.map(columnGroup.leafColumns, col => {
      let cellClasses;
      if (rowType === 'foot') {
        cellClasses = normalizeClass(col.footClasses, row);
      } else if (rowType === 'body') {
        cellClasses = normalizeClass(col.bodyClasses, row);
      }
      const cell = { classes: cellClasses, attributes: {} };
      cell.value = col.property.get(row.item);
      cell.html = col.template(_.pick(cell, 'value'));

      return cell;
    });
  }

  return _.defaults(patch, row, { attributes: {} });
}

/**
* Handle cells content.
*
* @param {Object} state All data, configurations and events needed in grid cells.
* @param {Object[]} [state.headRows] Grid header cells.
* @param {Object} [state.bodyRows] 
* @param {Number} [state.bodyRows.length] bodyRows' length
* @param {Function} [state.bodyRows.slice] Get bodyRows element
* @param {Object[]} [state.footRows] Grid footer cells.
* @param {Object} [state.columns] Column configurations.
*
*/
export const cells = {
  name: 'cells',
  handler(state) {
    const columnGroup = state.columnGroup;

    const headRows = _.reduce(state.headRows, (memo, row) => {
      if (row === 'column-header-rows') {
        return memo.concat(columnGroup.headerRows);
      }
      memo.push(translateRow(columnGroup, row, 'head'));
      return memo;
    }, []);

    const bodyRows = {
      length: state.bodyRows.length,
      slice: (begin = 0, end = state.bodyRows.length) => {
        return state.bodyRows.slice(begin, end)
          .map((row, index) => translateRow(columnGroup, row, 'body', index + begin));
      },
    };

    const footRows = _.map(state.footRows, (row, index) => translateRow(columnGroup, row, 'foot', index));

    return _.defaults({
      headRows,
      bodyRows,
      footRows,
    }, state);
  },
  defaults: {},
};

