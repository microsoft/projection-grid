import _ from 'underscore';
import $ from 'jquery';
import Backbone from 'backbone';
import ListView from 'backbone-virtualized-listview';

import ColumnGroup from './column-group.js';
import rowTemplate from './row.jade';
import tableTemplate from './table.jade';
import stickyHeaderTemplate from './sticky-header.jade';

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

function translateColumnGroup(columnGroup) {
  return _.map(columnGroup.leafColumns, col => ({
    classes: [`col-${col.name}`],
    width: _.isNumber(col.width) ? `${col.width}px` : col.width,
  }));
}

function translateHeader(columnGroup, rows) {
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

const getListTemplate = stickyHeader => ({
  headRows = [],
  footRows = [],
  columnGroup = [],
} = {}) => {
  return tableTemplate({
    cols: translateColumnGroup(columnGroup),
    header: translateHeader(columnGroup, headRows),
    footer: {
      rows: _.map(footRows, translateRow),
    },
    stickyHeader,
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
const HEADER_OPTIONS = ['columnGroup', 'headRows', 'events'];

class StickyHeaderView extends Backbone.View {
  initialize({ tableView }) {
    this.tableView = tableView;
  }

  _redraw() {
    const { columnGroup, headRows, events } = this.tableView._state;
    this.undelegateEvents();
    this.$el.html(stickyHeaderTemplate({
      cols: translateColumnGroup(columnGroup),
      header: translateHeader(columnGroup, headRows),
    }));
    this.delegateEvents(events);
  }

  render() {
    this._redraw();
    return this;
  }
}

export class TableView extends Backbone.View {
  initialize({
    viewport,
    virtualized = false,
    stickyHeader = false,
  }) {
    this._props = {
      viewport,
      virtualized,
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
      virtualized,
      viewport,
    }).set({
      listTemplate: getListTemplate(stickyHeader),
      itemTemplate,
    });

    if (stickyHeader) {
      this._stickyHeaderView = new StickyHeaderView({ tableView: this });
    }
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

    if (_.some(HEADER_OPTIONS, isSet) && this._stickyHeaderView) {
      this._stickyHeaderView._redraw();
    }

    return this;
  }

  _hookUpStickyHeader() {
    const viewport = this._listView.viewport;
    const $el = viewport.$el;
    const isWindow = $el.get(0) === window;

    this._listView.once('didRedraw', () => {
      const rectVP = viewport.getMetrics().outer;
      const $elViewport =  isWindow ? $(document.body) : $el;

      $elViewport.prepend(this._stickyHeaderView.render().el);
      if (!isWindow) {
        $elViewport.css({ position: 'relative' });
      }
      this._stickyHeaderView.$el.css({
        position: isWindow ? 'fixed' : 'absolute',
        display: 'none',
      });

      viewport.on('change', () => {
        const metricsVP = viewport.getMetrics();
        const rectVP = metricsVP.outer;
        const rectTable = this._listView.$('table').get(0).getBoundingClientRect();
        const offset = _.result(this._props.stickyHeader, 'offset', 0);
        const stickyTop = rectVP.top + offset;

        if (rectTable.top < stickyTop) {
          let left = rectTable.left;
          let top = stickyTop;

          this._stickyHeaderView.$el.show();
          if (!isWindow) {
            // If we are using the absolute postion
            //  * Add the left/top scroll offset
            //  * Minus the left/top of the offset parent
            const elOffsetParent = this._stickyHeaderView.el.offsetParent || document.documentElement;
            const rectParent = elOffsetParent.getBoundingClientRect();
            left += metricsVP.scroll.x - rectParent.left;
            top += metricsVP.scroll.y - rectParent.top;
          }

          this._stickyHeaderView.$el.css({ left, top });
        } else {
          this._stickyHeaderView.$el.hide();
        }
      });
    });
  }

  render(callback) {
    this.$el.html(this._listView.render(callback).el);
    if (this._stickyHeaderView) {
      this._hookUpStickyHeader();
    }
    return this;
  }

  remove() {
    this._listView.remove();
    if (this._stickyHeaderView) {
      this._stickyHeaderView.remove();
    }
    super.remove();
  }

  scrollToItem(...args) {
    this._listView.scrollToItem(...args);
  }
}

