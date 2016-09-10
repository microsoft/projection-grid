import _ from 'underscore';
import { normalizeClasses } from './common.js';

function translateRow({
  columnGroup,
  row,
  rowType,
  primaryKey,
}) {
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
        cellClasses = normalizeClasses(col.footClasses, row);
      } else if (rowType === 'body') {
        cellClasses = normalizeClasses(col.bodyClasses, row);
      } else if (rowType === 'head') {
        cellClasses = normalizeClasses(col.headClasses, row);
      }
      const cell = { classes: cellClasses, attributes: {} };
      cell.value = col.property.get(row.item);
      cell.html = col.template(_.pick(cell, 'value'));

      return cell;
    });

    patch.attributes = _.defaults({
      'data-key': row.item[primaryKey],
    }, row.attributes);
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
    const primaryKey = this.primaryKey;

    const headRows = _.reduce(state.headRows, (memo, row) => {
      if (row === 'column-header-rows') {
        return memo.concat(columnGroup.headerRows);
      }
      memo.push(translateRow({
        columnGroup,
        row,
        rowType: 'head',
        primaryKey,
      }));
      return memo;
    }, []);

    const bodyRows = {
      length: state.bodyRows.length,
      slice: (begin = 0, end = state.bodyRows.length) => {
        return state.bodyRows.slice(begin, end)
          .map(row => translateRow({
            columnGroup,
            row,
            rowType: 'body',
            primaryKey,
          }));
      },
    };

    const footRows = _.map(state.footRows, row => translateRow({
      columnGroup,
      row,
      rowType: 'foot',
      primaryKey,
    }));

    return _.defaults({
      headRows,
      bodyRows,
      footRows,
    }, state);
  },
  defaults: {},
};

