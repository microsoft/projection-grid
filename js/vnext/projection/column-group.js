import _ from 'underscore';
import { normalizeClasses } from './common.js';
import defaultCellTemplate from './default-cell.jade';

function stringProperty(property) {
  const segs = property.split('/');

  return {
    key: property,
    get(item) {
      return _.reduce(segs, (memo, key) => (memo || {})[key], item);
    },
    set(item, value) {
      return _.reduce(segs, (memo, seg, index) => {
        if (index < segs.length - 1) {
          if (!_.isObject(memo[seg])) {
            memo[seg] = {};
          }
        } else {
          memo[seg] = value;
        }
      }, item);
    },
  };
}

/**
 * @typedef PropertyConfig
 * @type {Object}
 * @property {PropertyGetter} get - The getter function.
 * @property {PropertySetter} set - The setter function.
 */

/**
 * @callback PropertyGetter
 * @param {Object} item - The data item.
 * @return {} - The value for the property.
 */

/**
 * @callback PropertySetter
 * @param {Object} item - The data item.
 * @param {} value - The value for the property.
 */

/**
 * It behaves as a {@link PropertyGetter} when passed 1 argument, and behaves
 * as a {@link PropertySetter} when passed 2 arguments.
 * @callback PropertyCallback
 * @param {Object} item - The data item.
 * @param {} [value] - The new value for the property.
 * @return {} - The value for the property.
 */

function normalizeProperty(property, column) {
  if (!property) {
    return stringProperty(column.name);
  }

  if (_.isString(property)) {
    return stringProperty(property);
  }
  
  if (_.isFunction(property)) {
    return {
      get: property,
      set: property,
    };
  }

  return property;
}

function normalizeDirection(direction) {
  if (_.isArray(direction)) {
    return direction;
  }

  if (_.isNumber(direction)) {
    return direction > 0 ? [1, -1] : [-1, 1];
  }

  return [1, -1];
}

/**
 * @typedef SortableConfig
 * @type {Object}
 * @property {string|PropertyGetter} key
 *    The sort key. It could be
 *    * A string, the key path of the sorting values.
 *    * A {@link PropertyGetter} to get the sorting values from data items.
 *      Only available for memory data source.
 *
 * @property {number|number[]} direction
 *    The direction could be
 *    * A number
 *      A number indicating the order on first click. Positive for ascending,
 *      otherwise descending.
 *    * An array of numbers
 *      Indicating the sequence of sorting orders.
 * 
 * @property {SortableHeaderTemplate} template
 *    A customized template to render the sortable column header.
 */

function normalizeSortable(sortable, column) {
  const columnKey = column.property.key || column.property.get;

  if (sortable === true) {
    return {
      key: columnKey,
      direction: normalizeDirection(1),
    };
  }

  if (_.isString(sortable) || _.isFunction(sortable)) {
    return {
      key: sortable,
      direction: normalizeDirection(1),
    };
  }

  if (_.isNumber(sortable) && sortable || _.isArray(sortable)) {
    return {
      key: columnKey,
      direction: normalizeDirection(sortable),
    };
  }

  if (_.isObject(sortable)) {
    const sortableKey = _.result(sortable, 'key', columnKey);
    return {
      key: _.isArray(sortableKey) ? _.result(sortableKey[0], 'key', columnKey) : sortableKey,
      direction: normalizeDirection(_.result(sortable, 'direction', 1)),
    };
  }

  return null;
}

/**
 * The column group class.
 *
 * It takes columns configuration as input and generates headerRows, leafColumns,
 * columnIndex and root(a tree-like column structure).
 *
 * @param {ColumnConfig[]} columns
 *    The columns configuration
 */
class ColumnGroup {
  constructor(columns) {
    
    /**
     * The column header rows
     * @type {RowContent[]}
     */
    this.headerRows = [];

    /**
     * The leaf columns
     * @type {ExtendedColumnConfig[]}
     */
    this.leafColumns = [];

    /**
     * The columns indexed by name
     * @type {Object.<string,ExtendedColumnConfig>}
     */
    this.columnIndex = {};

    /*
     * Build tree-like columns structure using DFS
     */
    const buildColumn = col => {
      /**
       * An extended internal representation of columns. It extends
       * {@link ColumnConfig} with several extra properties.
       * @typedef ExtendedColumnConfig
       * @type ColumnConfig
       * @property {ExtendedColumnConfig} parent
       *    The parent column if there's a column hierarchy.
       * @property {ExtendedColumnConfig[]} columns
       *    The children columns.
       * @property {CellContent} cell
       *    The configuration of the header cell.
       * @property {number} height
       *    The rowspan of the header cell.
       * @property {number} treeWidth
       *    The colspan of the header cell. The tree width of the column
       *    subtree in number of columns.
       * @property {number} treeHeight
       *    The height of the column subtree in number of rows.
       */
      const { parent, columns, height, name, property, sortable } = col;

      this.columnIndex[name] = col;
      
      col.property = normalizeProperty(property, col);
      col.sortable = normalizeSortable(sortable, col);

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

    /*
     * Build column header with DFS
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

    /**
     * The root column
     * @type {ExtendedColumnConfig}
     */
    this.root = buildColumn({
      name: '__root__',
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
    /**
     * The content of a `COL` element in `COLGROUP`.
     * @typedef ColContent
     * @type {Object}
     * @property {string[]} classes
     *    The classes of the `COL` element.
     * @property {number|string} width
     *    The CSS width for the column.
     */
    return {
      classes: colClasses,
      width: _.isNumber(col.width) ? `${col.width}px` : col.width,
    };
  });
}

/**
 * Resolve grid structure from columns configuration and build the
 * {@link ColumnGroup} object.
 *
 * @param {ContentChainState} state
 *    The input content chain state.
 * @return {ContentChainState}
 */
function columnGroupProjectionHandler(state) {
  const columnGroup = new ColumnGroup(state.columns || []);
  return _.defaults({
    columnGroup,
    cols: translateColumnGroup(columnGroup),
  }, state);
}

export const columnGroup = {
  name: 'columnGroup',
  handler: columnGroupProjectionHandler,
  defaults: {},
};

