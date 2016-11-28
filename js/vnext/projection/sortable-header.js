import _ from 'underscore';
import sortableHeaderTemplate from './sortable-header.jade';

const regexKey = /\s*(-)?\s*(\w+)/;

// Reorder column data referring to 'column.sortable'.
// 'column.sortable' takes four types of values: boolean, number, string and function.
function reorder(e) {
  const name = this.$(e.target).closest('th').attr('data-name');
  const sortable = this.columnWithName(name).sortable;

  if (sortable) {
    const sortableHeaderCur = this.get('sortableHeader') || {};
    let directionIndex = sortableHeaderCur.directionIndex;

    if (sortableHeaderCur.name === name) {
      directionIndex = (directionIndex + 1) % sortable.direction.length;
    } else {
      directionIndex = 0;
    }

    const direction = sortable.direction[directionIndex];

    this.patch({
      query: {
        orderby: direction ? [{
          key: sortable.key,
          direction,
        }] : [],
      },
      sortableHeader: { name, directionIndex },
    });
  }
}

/**
 * Add click event to sortable column and wrap sortable column's head with a template
 * @param {ContentChainState} state
 *    The input state.
 * @param {SortableHeaderConfig} options
 *    The sortable header configurations.
 */
function sortableHeaderProjectionHandler(state, {
  name,
  directionIndex,
  template = sortableHeaderTemplate,
} = {}) {
  /**
   * @typedef SortableHeaderConfig
   * @type {Object}
   * @property {string} name
   *    The name of the ordered column.
   * @property {number} directionIndex
   *    The index of direction in the direction sequence.
   * @property {?SortableHeaderTemplate} template
   *    The template to render the sortable column headers.
   */
  const patch = {};
  const leafColumns = state.columnGroup.leafColumns;
  const leafColumnIndex = _.reduce(leafColumns, (memo, col) => {
    memo[col.name] = col;
    return memo;
  }, {});

  patch.headRows = _.map(state.headRows, row => {
    const cells = _.map(row.cells, cell => {
      const patchCell = {};
      const column = leafColumnIndex[cell.name];

      if (column && column.sortable) {
        patchCell.classes = cell.classes.concat('column-header-sortable');

        const decorationTemplate = column.sortable.template || template;
        const direction = column.name === name ? column.sortable.direction[directionIndex] : 0;

        /**
         * @callback SortableHeaderTemplate
         * @param {Object} locals
         * @param {string} locals.html
         *    The original HTML string for the column header.
         * @param {number} locals.direction
         *    The sort state.
         *    * Positive value for ascending.
         *    * Negative value for descending.
         *    * 0 for not sorted.
         */
        patchCell.html = decorationTemplate({
          html: cell.html,
          direction,
        });
      }

      return _.defaults(patchCell, cell);
    }); 

    return _.defaults({ cells }, row);
  });

  patch.events = _.defaults({
    'click th.column-header-sortable': reorder,
  }, state.events);

  return _.defaults(patch, state);
}

export const sortableHeader = {
  name: 'sortableHeader',
  handler: sortableHeaderProjectionHandler,
  defaults: {},
};

