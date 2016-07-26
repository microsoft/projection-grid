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

const STATE_OPTIONS = ['columnGroup', 'headRows', 'bodyRows', 'footRows', 'events'];
const MODEL_OPTIONS = ['columnGroup', 'headRows', 'footRows'];
const ITEMS_OPTIONS = ['columnGroup', 'bodyRows'];

class TableView extends Backbone.View {
  initialize({
    virtualized = false,
    viewport = false,
    stickyHeader = false,
  }) {
    this._props = {
      virtualized,
      viewport,
      stickyHeader,
    };

    this._state = {
      columnGroup: new ColumnGroup([]),
      headRows: [],
      bodyRows: [],
      footRows: [],
      events: {},
    };

    this._listView = new ListView({
      el: this.$el,
      virtualized,
      viewport,
    }).set({
      listTemplate,
      itemTemplate,
    });
  }

  set(state = {}, callback = _.noop) {
    const isSet = key => !_.isUndefined(state[key]);
    const listState = {};

    if (isSet('columns')) {
      state.columnGroup = new ColumnGroup(state.columns);
    }

    _.extend(this._state, _.pick(state, STATE_OPTIONS));

    if (_.some(MODEL_OPTIONS, isSet)) {
      listState.model = _.pick(this._state, MODEL_OPTIONS);
    }
    if (_.some(ITEMS_OPTIONS, isSet)) {
      listState.items = getItems(_.pick(this._state, ITEMS_OPTIONS));
    }
    if (isSet('events')) {
      listState.events = this._state.events;
    }

    this._listView.set(listState, callback);

    return this;
  }

  render(callback) {
    this._listView.render(callback);
    return this;
  }

  scrollToItem(...args) {
    this._listView.scrollToItem(...args);
  }
}

export default TableView;

