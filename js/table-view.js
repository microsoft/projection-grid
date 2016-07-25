import _ from 'underscore';
import Backbone from 'backbone';
import VirtualizedListView from 'backbone-virtualized-listview';

import ListView from './list-view.js';
import rowTemplate from './row.jade';
import tableTemplate from './table.jade';

const getLeafColumns = columns => {
  return _.chain(columns).map(column => {
    if (column.columns) {
      return getLeafColumns(column.columns);
    } else {
      return column;
    }
  }).flatten().value();
};

function buildColumnHeaderRows(columns) {
  const rows = [];
  const leaves = [];
  let depthMax = 0;

  function buildColumnHeader(column, depth) {
    if (depth > depthMax) {
      depthMax = depth;
    }
    if (!rows[depth]) {
      rows[depth] = { cells: [] };
    }
    const cells = rows[depth].cells;
    const html = column.html || column.name;
    let cell = { rowspan: 1, colspan: 1, html, depth };
    if (column.columns) {
      const height = _.result(column, 'height', 1);
      cell.colspan = _.reduce(
        column.columns,
        (memo, col) => memo + buildColumnHeader(col, depth + height),
        0
      );
      cell.rowspan = height;
    } else {
      leaves.push(cell);
    }
    cells.push(cell);
    return cell.colspan;
  }

  _.each(columns, column => buildColumnHeader(column, 0));
  _.each(leaves, cell => (cell.rowspan = depthMax - cell.depth + 1));

  return rows;
}

function buildBodyCells(columns, item) {
  const cells = [];
  function buildColumnCell(column) {
    if (column.columns) {
      _.each(column.columns, buildColumnCell);
    } else {
      const cell = item[column.name];
      const html = _.isObject(cell) ? _.result(cell, 'html', '') : cell;
      cells.push({ html });
    }
  }
  _.each(columns, buildColumnCell);
  return cells;
}

function buildHeaderRows(columns, rows) {
  const result = _.chain(rows).map(row => {
    if (row === 'column-header-rows') {
      return buildColumnHeaderRows(columns);
    } else if (row.item) {
      return {
        classes: row.classes || [],
        cells: buildBodyCells(columns, row.item),
      };
    } else if (row.html) {
      return {
        classes: row.classes || [],
        cells: [{
          colspan: 7,
          html: row.html,
        }],
      }
    }
  }).flatten().value();
  console.log(result);

  return result;
}

class TableView extends Backbone.View {
  initialize({
    virtualize = false,
    fixedHeader = false,
    columns = [],
    headRows = [],
    bodyRows = [],
    footRows = [],
    events = {},
  }) {
    const listTemplate = () => tableTemplate({
      header: {
        rows: buildHeaderRows(columns, headRows),
      },
      footer: {
        rows: footRows,
      },
    });

    const itemTemplate = row => rowTemplate({
      row: {
        cells: buildBodyCells(columns, row.item),
      },
    });


    this.listView = virtualize ? new VirtualizedListView({
      el: this.$el,
      listTemplate,
      itemTemplate,
      items: bodyRows,
    }) : new ListView({
      el: this.$el,
      listTemplate,
      itemTemplate,
      items: bodyRows,
    });
  }

  reset({}) {
  }

  render() {
    this.listView.render();
    return this;
  }

  scrollToItem(...args) {
    this.listView.scrollToItem(...args);
  }
}

export default TableView;

