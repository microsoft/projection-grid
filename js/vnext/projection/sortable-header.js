import _ from 'underscore';
import sortableHeaderTemplate from './sortable-header.jade';

const regexKey = /\s*(-)?\s*(\w+)/;

function reorder(e) {
  const name = this.$(e.target).attr('data-name');
  const column = this.columnWithName(name);
  let sortable = column.sortable;

  if (_.isString(sortable) || _.isFunction(sortable)) {
    sortable = {
      key: sortable,
      direction: 1,
    };
  } else if (_.isNumber(sortable) && sortable) {
    sortable = {
      key: column.value || column.field || column.name,
      direction: sortable,
    };
  } else if (sortable === true) {
    sortable = {
      key: column.value || column.field || column.name,
      direction: 1,
    };
  }

  if (sortable) {
    const sortableHeaderCur = this.get('sortableHeader') || {};
    let direction = sortable.direction;
    if (sortableHeaderCur.name === name) {
      direction = -sortableHeaderCur.direction;
    }

    const sortableHeader = { name, direction };

    const dataSource = _.defaults({
      orderby: [{
        key: sortable.key,
        direction,
      }],
    }, this.get('dataSource'));

    this.set({ dataSource, sortableHeader });
  }
}

export function sortableHeader(state, {
  name,
  direction,
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

        if (column.name === name) {
          patchCell.html = sortableHeaderTemplate({
            html: cell.html,
            direction,
          });
        }
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

