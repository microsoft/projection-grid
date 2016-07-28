import _ from 'underscore';
import $ from 'jquery';
import Backbone from 'backbone';
import ListView from 'backbone-virtualized-listview';

import { StickyHeaderView } from './sticky-header.js'; 

import rowTemplate from './row.jade';
import tableTemplate from './table.jade';

const STATE_OPTIONS = ['cols', 'headRows', 'bodyRows', 'footRows', 'events'];
const MODEL_OPTIONS = ['cols', 'headRows', 'footRows'];
const ITEMS_OPTIONS = ['bodyRows'];
const HEADER_OPTIONS = ['cols', 'headRows', 'events'];

function getListTemplate(stickyHeader) {
  return model => tableTemplate({
    stickyHeader,
    header: { rows: model.headRows },
    footer: { rows: model.footRows },
    cols: model.cols,
  });
}

function getItems({ bodyRows }) {
  return {
    length: bodyRows.length,
    slice(start, stop) {
      return _.map(bodyRows.slice(start, stop), row => ({ row }))
    },
  };
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
      cols: [],
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
      itemTemplate: rowTemplate,
    });

    if (stickyHeader) {
      this._stickyHeaderView = new StickyHeaderView({ tableView: this });
    }
  }

  set(state = {}, callback = _.noop) {
    const isSet = key => !_.isUndefined(state[key]);
    const listState = {};

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

  render(callback) {
    this.$el.html(this._listView.render(callback).el);
    if (this._stickyHeaderView) {
      this._stickyHeaderView.render();
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

