import _ from 'underscore';
import sortableHeaderTemplate from './sortable-header.jade';

const regexKey = /\s*(-)?\s*(\w+)/;

/**
 * Reorder column data referring to 'column.sortable'.
 * 'column.sortable' takes four types of values: boolean, number, string and function.
 */
function reorder(e) {
  const name = this.$(e.target).closest('th').attr('data-name');
  const sortable = this.columnWithName(name).sortable;

  if (sortable) {
    const sortableHeaderCur = this.get('sortableHeader') || {};
    let direction = sortable.direction;

    if (sortableHeaderCur.name === name) {
      direction = -sortableHeaderCur.direction;
    }

    this.patch({
      dataSource: {
        orderby: [{
          key: sortable.key,
          direction,
        }],
      },
      sortableHeader: { name, direction },
    });
  }
}

/**
 * Add click event to sortable column and wrap sortable column's head with a template
 *
 * @param {Object} state
 * @param {Object[]} [state.headRows]
 * @param {Object} [state.events]
 * @param {String} name sortable column name
 * @param {Number} direction sortable direction: ascending or decending
 *
 */
export const sortableHeader = {
  name: 'sortableHeader',
  handler(state, {
    name,
    direction,
    template = sortableHeaderTemplate,
  } = {}) {
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

          patchCell.html = decorationTemplate({
            html: cell.html,
            direction: column.name === name ? direction : 0,
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
  },
  defaults: {},
};

