import _ from 'underscore';
import { normalizeClasses, normalizeAttributes } from './common.js';

/**
 * Translate the {@link RowConfig} into {@link RowContent}
 * @param {Object} options
 * @param {ColumnGroup} options.columnGroup
 *    The column group.
 * @param {RowConfig} options.row
 *    The {@link RowConfig} to translate.
 * @param {string} rowType
 *    Which group the row belongs to. It could be 'head', 'body' or 'foot'.
 * @param {string} primaryKey
 *    The primary key of the data items.
 * @return {RowContent}
 */
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
      let cellClasses, cellAttributes;

      if (rowType === 'foot') {
        cellClasses = normalizeClasses(col.footClasses, row);
        cellAttributes = normalizeAttributes(col.footAttributes, row);
      } else if (rowType === 'body') {
        cellClasses = normalizeClasses(col.bodyClasses, row);
        cellAttributes = normalizeAttributes(col.bodyAttributes, row);
      } else if (rowType === 'head') {
        cellClasses = normalizeClasses(col.headClasses, row);
        cellAttributes = normalizeAttributes(col.headAttributes, row);
      }

      /**
       * The object represents a cell.
       * @typedef CellContent
       * @type {Object}
       * @property {string[]} classes
       *    The classes for the `TD`/`TH` element
       * @property {Object.<string,string>} attributes
       *    The HTML attributes for the `TD`/`TH` element.
       * @property {string} html
       *    The HTML string to be rendered inside the cell.
       * @property {Backbone.View} view
       *    The Backbone View to be filled into the cell. Unsupported for
       *    the body cells.
       * @property {boolean} [sticky=false]
       *    Sticky the column
       */
      const cell = { classes: cellClasses, attributes: cellAttributes };
      cell.value = col.property.get(row.item);
      cell.html = col.template(_.pick(cell, 'value'));
      cell.sticky = _.result(columnGroup.columnIndex[col.name], 'sticky', false);

      return cell;
    });

    patch.attributes = _.defaults({
      'data-key': row.item[primaryKey],
    }, row.attributes);
  }

  /**
   * Extends the {@link RowConfig} with extra properties
   * @typedef RowContent
   * @type {RowConfig}
   * @property {CellContent[]} cells
   *    The cells in the row.
   * @property {Object.<string,string>} attributes
   *    The HTML attributes for the `TR` element.
   */
  return _.defaults(patch, row, { attributes: {} });
}

/**
 * Fill the headRows, bodyRows and footRows with cells.
 * @param {ContentChainState} state
 *    All data, configurations and events needed in grid cells.
 * @return {ContentChainState}
 */
function cellsProjectionHandler(state) {
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
}


export const cells = {
  name: 'cells',
  handler: cellsProjectionHandler,
  defaults: {},
};

