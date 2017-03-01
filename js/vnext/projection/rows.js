import _ from 'underscore';
import { normalizeClasses, normalizeAttributes } from './common.js';

const bufferStateClasses = {
  changed: ['row-buffer-changed'],
  committed: ['row-buffer-committed'],
};

/**
 * Configuration for a row. It can be an object or a special
 * @typedef RowConfig
 * @type {(string|Object)}
 * @property {?string} type
 *    Optional parameter to define the type of the row. Special values are
 *    * `'data-rows'`. A row configuration which will be expanded into
 *      multiple rows representing each of the data items.
 *    * `'data'`. Indicating the row is expanded from the `'data-rows'`.
 *
 * @property {?ClassesConfig} classes
 *    The classes of the `TR` element.
 * @property {?AttributesConfig} attributes
 *    The attributes of the `TR` element.
 * @property {?Object} item
 *    The data item for the row.
 * @property {?string} html
 *    The HTML string rendered in a cell taking the entire row.
 * @property {?Backbone.View} view
 *    The Backbone View take the place of the entire row. This is is only for
 *    the header and footer rows.
 */

/**
 * The configuration for rows projection. When defining header rows, it can be
 * a special string `'column-header-rows'`, representing all the column header
 * rows.
 * @typedef RowsConfig
 * @type {(string|Object)}
 * @property {RowConfig[]} headRows
 *    Row configurations for `THEAD`. It can take a special string value
 *    `column-header-rows`, which will be expanded into the column headers.
 * @property {RowConfig[]} bodyRows
 *    Row configurations for `TBODY`. It can take a special row with type
 *    `data-rows`. This row will be expanded, one for each data item.
 * @property {RowConfig[]} footRows - Row configurations for `TFOOT`.
 */

/**
 * Handling bodyRows and adding headRows, bodyRows, footRows to state
 * @param {StructureChainState} state - The input state.
 * @param {RowsConfig} options - The configuration for rows projection.
 * @return {StructureChainState}
 */
function rowsProjectionHandler(state, {
  headRows = ['column-header-rows'],
  footRows = [],
  bodyRows = ['data-rows'],
} = {}) {
  const patch = { headRows, footRows };

  const primaryKey = state.primaryKey;
  const changed = this.get('buffer').changed || {};

  // TODO [wewei], use Fake items for better performance.
  const items = state.items.slice(0, state.items.length);

  patch.bodyRows = _.reduce(bodyRows, (memo, row) => {
    if (row === 'data-rows' || row.type === 'data-rows') {
      _.each(items, item => {
        const key = item[primaryKey];
        const bufferState = _.chain(changed).result(key).result('state').value();
        const classes = _.union(
          normalizeClasses(row.classes, item),
          _.result(bufferStateClasses, bufferState, [])
        );
        const attributes = normalizeAttributes(row.attributes, item);

        memo.push({ item, classes, type: 'data', attributes });
      });
    } else if (row.view) {
      throw new Error('Body row cannot have subviews');
    } else {
      memo.push(row);
    }

    return memo;
  }, []);

  return _.defaults(patch, state);
}

export const rows = {
  name: 'rows',
  handler: rowsProjectionHandler,
  defaluts: {},
};
