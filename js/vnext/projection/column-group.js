import _ from 'underscore';
import defaultCellTemplate from './default-cell.jade';

class ColumnGroup {
  constructor(columns) {
    this.headerRows = [];
    this.leafColumns = [];
    this.columnIndex = {};

    const buildColumn = col => {
      const { parent, columns, height, name } = col;

      this.columnIndex[name] = col;
      
      if (!col.property) {
        col.property = name;
      }
      if (_.isString(col.property)) {
        const propName = col.property;
        col.property = { 
          get({ index, item }) {
            return _.chain(propName.split('/')).reduce(_.result, item).value();
          },
          set({ item, value }) {
            const segs = propName.split('/');
            return _.chain(segs).reduce((memo, seg, index) => {
              if (index < segs.length - 1) {
                if (!_.has(memo, seg)) {
                  memo[seg] = {};
                } else if (!_.isObject(memo[seg])) {
                  memo[seg] = Object(memo[seg]);
                } 
              } else {
                memo[seg] = value;
              }
            }, item).value();
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

    const buildColumnHeader = col => {
      if (col.parent) {
        const colspan = col.treeWidth;
        const rowspan = _.isEmpty(col.columns) ? this.root.treeHeight - col.rowIndex : col.height;
        const name = col.name;
        const html = col.html || col.title || col.name;

        while (this.headerRows.length <= col.rowIndex) {
          this.headerRows.push({ cells: [], attributes: {} });
        }

        const classes = ['column-header'];
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
  return _.map(columnGroup.leafColumns, col => ({
    classes: [`col-${col.name}`],
    width: _.isNumber(col.width) ? `${col.width}px` : col.width,
  }));
}

export function columnGroup(state) {
  const columnGroup = new ColumnGroup(state.columns || []);
  return _.defaults({
    columnGroup,
    cols: translateColumnGroup(columnGroup),
  }, state);
}

