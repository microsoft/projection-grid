import _ from 'underscore';
import Backbone from 'backbone';
import ListView from 'backbone-virtualized-listview';

import ColumnGroup from './column-group.js';
import rowTemplate from './row.jade';
import tableTemplate from './table.jade';

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
    return {
      classes: row.classes,
      cells: _.map(columnGroup.leafColumns, col => row.item[col.name] || {}),
    };
  }
  return row;
}

const listTemplate = ({ headRows, footRows, columnGroup }) => {
  return tableTemplate({
    cols: _.map(columnGroup.leafColumns, col => ({
      classes: [`col-${col.name}`]
    })),
    header: {
      rows: _.reduce(headRows, (memo, row) => {
        if (row === 'column-header-rows') {
          return memo.concat(columnGroup.headerRows);
        }
        memo.push(translateRow(columnGroup, row));
        return memo;
      }, []),
    },

    footer: {
      rows: _.map(footRows, translateRow),
    },
  });
};

const itemTemplate = rowTemplate;

function getItems({ columnGroup, bodyRows }) {
  return {
    length: bodyRows.length,
    slice(start, stop) {
      return _.map(bodyRows.slice(start, stop), row => ({
        row: {
          classes: row.classes,
          cells: _.map(columnGroup.leafColumns, col => row.item[col.name]),
        },
      }));
    },
  };
}

const MODEL_OPTIONS = ['columnGroup', 'headRows', 'footRows'];
const ITEMS_OPTIONS = ['columnGroup', 'bodyRows'];

class TableView extends Backbone.View {
  initialize({
    scrolling = {},
    columns = [],
    headRows = [],
    bodyRows = [],
    footRows = [],
    events = {},
  }) {
    this.options = {
      columnGroup: new ColumnGroup(columns),
      headRows,
      bodyRows,
      footRows,
      events,
    };

    const { virtualized, stickyHeader, viewport } = _.defaults(scrolling, {
      virtualized: false,
      stickyHeader: false,
      viewport: null,
    });

    this.listView = new ListView({
      el: this.$el,
      virtualized,
      viewport,
      listTemplate,
      itemTemplate,
      items: getItems(_.pick(this.options, ITEMS_OPTIONS)),
      model: _.pick(this.options, MODEL_OPTIONS),
      events,
    });
  }

  reset(options = {}, callback) {
    const isSet = key => _.has(options, key);
    const changed = {};

    if (isSet('columns')) {
      options.columnGroup = new ColumnGroup(options.columns);
      delete options.columns;
    }

    _.extend(this.options, options);

    if (_.some(MODEL_OPTIONS, isSet)) {
      changed.model = _.pick(this.options, MODEL_OPTIONS);
    }
    if (_.some(ITEMS_OPTIONS, isSet)) {
      changed.items = getItems(_.pick(this.options, ITEMS_OPTIONS));
    }
    if (_.has(options, 'events')) {
      changed.events = options.events;
    }
    this.listView.reset(changed, callback);
  }

  render(callback) {
    this.listView.render(callback);
    return this;
  }

  scrollToItem(...args) {
    this.listView.scrollToItem(...args);
  }
}

export default TableView;

