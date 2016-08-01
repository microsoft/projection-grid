import _ from 'underscore';

const regexKey = /\s*(-)?\s*(\w+)/;

function reorder(e) {
  const name = this.$(e.target).attr('data-name');

  this.set({
    dataSource: _.defaults({
      orderby: [{ [name] : 1 }],
    }, this.get('dataSource')),
  });
}

export function sortableHeader(state) {
  const orderBy = this.get('dataSource').orderBy || [];
  const leafColumns = state.columnGroup.leafColumns;
  const leafColumnIndex = _.reduce(leafColumns, (memo, col) => {
    memo[col.name] = true;
    return memo;
  }, {});
  const headRows = _.map(state.headRows, row => {
    const cells = _.map(row.cells, cell => {
      if (leafColumnIndex[cell.name]) {
        const html = '<span>$</span>' + cell.html;
        return _.defaults({ html }, cell);
      }
      return cell;
    }); 

    return _.defaults({ cells }, row);
  });

  const events = _.defaults({
    'click th.column-header-leaf': reorder,
  }, events);

  return _.defaults({ headRows, events }, state);
}

