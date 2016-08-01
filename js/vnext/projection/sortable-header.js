import _ from 'underscore';
import sortableHeaderTemplate from './sortable-header.jade';

const regexKey = /\s*(-)?\s*(\w+)/;

function reorder(e) {
  const name = this.$(e.target).attr('data-name');
  const column = this.columnWithName(name);

  if (column.sortable) {
    const dataSource = this.get('dataSource');
    const orderby = _.first(dataSource.orderby);
    const [key, dir] = _.first(_.pairs(orderby)) || [];
    const direction = key === name ? dir * -1 : 1;

    this.set({
      dataSource: _.defaults({
        orderby: [{ [name] : direction }],
      }, this.get('dataSource')),
    });
  }
}

export function sortableHeader(state) {
  const orderby = _.first(this.get('dataSource').orderby);
  const patch = {};
  const [key, direction] = _.first(_.pairs(orderby)) || [];
  const leafColumns = state.columnGroup.leafColumns;
  const leafColumnIndex = _.reduce(leafColumns, (memo, col) => {
    memo[col.name] = col;
    return memo;
  }, {});

  patch.headRows = _.map(state.headRows, row => {
    const cells = _.map(row.cells, cell => {
      if (_.result(leafColumnIndex[cell.name], 'sortable')) {
        const patchCell = {}
        patchCell.classes = cell.classes.concat('column-header-sortable');
        if (cell.name === key) {
          patchCell.html = sortableHeaderTemplate({
            html: cell.html,
            direction,
          });
        }
        return _.defaults(patchCell, cell);
      }
      return cell;
    }); 

    return _.defaults({ cells }, row);
  });

  patch.events = _.defaults({
    'click th.column-header-sortable': reorder,
  }, state.events);

  return _.defaults(patch, state);
}

