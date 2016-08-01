import _ from 'underscore';

function translateRow(columnGroup, row) {
  if (_.has(row, 'html')) {
    return {
      classes: row.classes,
      cells: [{
        attributes: {
          rowspan: 1,
          colspan: columnGroup.width,
        },
        html: row.html,
      }],
      attributes: row.attributes || {},
    };
  }
  if (_.has(row, 'view')) {
    return {
      classes: row.classes,
      cells: [{
        attributes: {
          rowspan: 1,
          colspan: columnGroup.width,
        },
        view: row.view,
      }],
      attributes: row.attributes || {},
    };
  }
  if (_.has(row, 'item')) {
    const obj =  {
      classes: row.classes,
      cells: _.map(columnGroup.leafColumns, col => {
        const cell = { classes: col.classes, attributes: {} };
        if (col.template) {
          cell.html = col.template(row.item);
        } else if (col.value) {
          cell.value = col.value(row.item);
        } else if (col.field) {
          cell.value = _.chain(col.field.split('/')).reduce((memo, key) => (memo[key]), row.item).value();
        } else {
          cell.value = _.isNull(row.item[col.name]) ? '' : row.item[col.name];
        }
        
        return cell;
      }),
      attributes: row.attributes || {},
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
    memo.push(translateRow(columnGroup, row, 'head'));
    return memo;
  }, []);

  bodyRows = _.map(bodyRows, row => translateRow(columnGroup, row, 'body'));
  footRows = _.map(footRows, row => translateRow(columnGroup, row, 'foot'));

  return _.defaults({
    headRows,
    bodyRows,
    footRows,
  }, state);
}
