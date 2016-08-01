import _ from 'underscore';

function translateRow(columnGroup, row, group) {
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
        const cell = row.item[col.name] || {};
        const classes = col.classes;
        const template = col[group + 'Template'];
        const defaultHTML = _.isObject(cell) ? cell.name : cell;
        const html = _.result(cell, 'html', template ? template(group == 'head' ? col : row.item) : defaultHTML);
        
        return { classes, html, attributes: {} };
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
