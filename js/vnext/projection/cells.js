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
        cell.value = col.property.get({ index, item: row.item });
        cell.html = col.template(_.pick(cell, 'value'));

        return cell;
      }),
      attributes: row.attributes || {},
    };

    return obj;
  }

  return row;
}

/**
* Render cells in grid.
*
* @param {Object} state All data, configurations and events needed in grid cells.
* @param {Array} [state.headRows] Grid header cells.
* @param {Array} [state.bodyRows] Duck typed array. Grid body cells.
* @Param {Array} [state.footRows] Grid footer cells.
* @param {Object} [state.columns] Column configurations.
*
*/
export function cells(state) {
  const columnGroup = state.columnGroup;

  const headRows = _.reduce(state.headRows, (memo, row) => {
    if (row === 'column-header-rows') {
      return memo.concat(columnGroup.headerRows);
    }
    memo.push(translateRow(columnGroup, row));
    return memo;
  }, []);

  const bodyRows = {
    length: state.bodyRows.length,
    slice: (begin = 0, end = state.bodyRows.length) => {
      return state.bodyRows.slice(begin, end)
        .map((row, index) => translateRow(columnGroup, row, index + begin));
    },
  };

  const footRows = _.map(footRows, (row, index) => translateRow(columnGroup, row, index));

  return _.defaults({
    headRows,
    bodyRows,
    footRows,
  }, state);
}
