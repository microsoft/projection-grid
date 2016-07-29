import _ from 'underscore';

function translateRow(columnGroup, row) {
  if (_.has(row, 'html')) {
    return {
      classes: row.classes,
      cells: [{
        rowspan: 1,
        colspan: columnGroup.width,
        html: row.html,
      }],
    };
  }
  if (_.has(row, 'item')) {
    const obj =  {
      classes: row.classes,
      cells: _.map(columnGroup.leafColumns, col => {
        const cell = row.item[col.name] || {};
        const tpl = col.template || col.headerTemplate || col.footerTemplate;
        if (tpl) {
          cell.html =  _.isFunction(tpl) ? tpl(row.item) : tpl;
        }
        return cell;
      }),
    };

    return obj;
  }
  return row;
}

export function cells(state) {
  let {
    headRows,
    bodyRows,
    footRows,
    columnGroup,
  } = state;

  headRows = _.reduce(headRows, (memo, row) => {
    if (row === 'column-header-rows') {
      return memo.concat(columnGroup.headerRows);
    }
    memo.push(translateRow(columnGroup, row));
    return memo;
  }, []);

  bodyRows = _.map(bodyRows, row => translateRow(columnGroup, row));
  footRows = _.map(footRows, row => translateRow(columnGroup, row));

  return _.defaults({
    headRows,
    bodyRows,
    footRows,
  }, state);
}
