import _ from 'underscore';
import { normalizeClasses } from './common.js';
import defaultCellTemplate from './default-cell.jade';

/**
* The column group class.
* It takes columns configuration as input and generates headerRows, leafColumns, columnIndex and root(a tree-like column structure).
*/
class ColumnGroup {
  constructor(columns) {
    this.headerRows = [];
    this.leafColumns = [];
    this.columnIndex = {};

/**
* Build tree-like columns structure using DFS
*/
    const buildColumn = col => {
      const { parent, columns, height, name } = col;

      this.columnIndex[name] = col;
      
      if (!col.property) {
        col.property = name;
      }
      if (_.isString(col.property)) {
        const propName = col.property;
        const segs = propName.split('/');
        col.property = { 
          get(item) {
            return _.reduce(segs, (memo, key) => (memo || {})[key], item);
          },
          set(item, value) {
            return _.reduce(segs, (memo, seg, index) => {
              if (index < segs.length - 1) {
                if (!_.has(memo, seg)) {
                  memo[seg] = {};
                } else if (!_.isObject(memo[seg])) {
                  memo[seg] = Object(memo[seg]);
                } 
              } else {
                memo[seg] = value;
              }
            }, item);
          },
        }
      } else if (_.isFunction(col.property)) {
        const propFunction = col.property;
        col.property = {
          get: propFunction,
          set: propFunction,
        };
      }

      if (!_.isFunction(col.template)) {
        col.template = defaultCellTemplate;
      }
      col.height  = _.isNumber(height) ? height : 1;
      col.rowIndex = parent ? parent.rowIndex + parent.height : 0;
      col.columns = _.map(columns, c => buildColumn(_.extend({ parent: col }, c)));
      col.treeHeight = col.height;
      col.treeWidth = 1;
      if (!_.isEmpty(col.columns)) {
        col.treeHeight += _.chain(col.columns)
          .map(_.property('treeHeight')).max().value();
        col.treeWidth = _.chain(col.columns)
          .map(_.property('treeWidth')).reduce((a, b) => a + b, 0).value();
      } else {
        this.leafColumns.push(col);
      }

      return col;
    };

/**
* Build column header with BFS
*/
    const buildColumnHeader = col => {
      if (col.parent) {
        const colspan = col.treeWidth;
        const rowspan = _.isEmpty(col.columns) ? this.root.treeHeight - col.rowIndex : col.height;
        const name = col.name;
        const html = col.html || col.title || col.name;

        while (this.headerRows.length <= col.rowIndex) {
          this.headerRows.push({ cells: [], attributes: {} });
        }

        const classes = _.union(normalizeClasses(col.headClasses, col), ['column-header']);
        if (_.isEmpty(col.columns)) {
          classes.push('column-header-leaf');
        }
        const attributes = {
          colspan,
          rowspan,
          'data-name': name,
        };
        col.cell = { html, name, classes, attributes };
        this.headerRows[col.rowIndex].cells.push(col.cell);
      }
      _.each(col.columns, buildColumnHeader);
    };

    this.root = buildColumn({
      name: '$root',
      height: 0,
      columns,
    });

    buildColumnHeader(this.root);
  }

  columnWithName(name) {
    return this.columnIndex[name];
  }

  get height() {
    return this.root.treeHeight;
  }

  get width() {
    return this.root.treeWidth;
  }
}

function translateColumnGroup(columnGroup) {
  return _.map(columnGroup.leafColumns, col => {
    const colClasses = _.union(normalizeClasses(col.colClasses, col), [`col-${col.name}`]);
    return {
      classes: colClasses,
      width: _.isNumber(col.width) ? `${col.width}px` : col.width,
    }
  });
}

/**
* Resolve grid structure from columns configuration
*
* @param {Object} state
* @param {Object[]} [state.columns] columns configuration
*
*/
export const columnGroup = {
  name: 'columnGroup',
  handler(state) {
    const columnGroup = new ColumnGroup(state.columns || []);
    return _.defaults({
      columnGroup,
      cols: translateColumnGroup(columnGroup),
    }, state);
  },
  defaults: {},
};

