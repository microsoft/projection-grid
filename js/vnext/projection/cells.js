import _ from 'underscore';

function translateRow(columnGroup, row, index) {
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
        if (col.property) {
          const property = col.property;
          if (_.isFunction(property)) {
            cell.value = property(row.item);
          } else {
            cell.value = _.chain(property.split(/[\.\/]/)).reduce((memo, key) => (memo || {})[key], row.item).value();
          }
        } else {
          cell.value = _.isNull(row.item[col.name]) ? '' : row.item[col.name];
        }

        if (col.template) {
          cell.html = col.template({ index, item: cell });
        } else {
          cell.html = cell.value;
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
    memo.push(translateRow(columnGroup, row));
    return memo;
  }, []);

  bodyRows = _.map(bodyRows, (row, index) => translateRow(columnGroup, row, index));
  footRows = _.map(footRows, (row, index) => translateRow(columnGroup, row, index));

  return _.defaults({
    headRows,
    bodyRows,
    footRows,
  }, state);
}
