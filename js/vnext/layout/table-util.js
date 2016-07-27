import _ from 'underscore';

export function translateRow(columnGroup, row) {
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
    return {
      classes: row.classes,
      cells: _.map(columnGroup.leafColumns, col => row.item[col.name] || {}),
    };
  }
  return row;
}

export function translateColumnGroup(columnGroup) {
  return _.map(columnGroup.leafColumns, col => ({
    classes: [`col-${col.name}`],
    width: _.isNumber(col.width) ? `${col.width}px` : col.width,
  }));
}

export function translateHeader(columnGroup, rows) {
  return {
    rows:  _.reduce(rows, (memo, row) => {
      if (row === 'column-header-rows') {
        return memo.concat(columnGroup.headerRows);
      }
      memo.push(translateRow(columnGroup, row));
      return memo;
    }, []),
  };
}

