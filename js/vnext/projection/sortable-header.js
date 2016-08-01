import _ from 'underscore';
import sortableHeaderTemplate from './sortable-header.jade';

const regexKey = /\s*(-)?\s*(\w+)/;

function reorder(e) {
  const name = this.$(e.target).attr('data-name');
  const column = this.columnWithName(name);

  if (!_.has(column, 'sortable') || column.sortable) {
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
  if (orderby) {
    const [key, direction] = _.first(_.pairs(orderby)) || [];
    const leafColumns = state.columnGroup.leafColumns;
    const leafColumnIndex = _.reduce(leafColumns, (memo, col) => {
      memo[col.name] = true;
      return memo;
    }, {});
    patch.headRows = _.map(state.headRows, row => {
      const cells = _.map(row.cells, cell => {
        if (leafColumnIndex[cell.name] && cell.name === key) {
          const html = sortableHeaderTemplate({
            html: cell.html,
            direction,
          });
          return _.defaults({ html }, cell);
        }
        return cell;
      }); 

      return _.defaults({ cells }, row);
    });
  }


  patch.events = _.defaults({
    'click th.column-header-leaf': reorder,
  }, state.events);

  return _.defaults(patch, state);
}

