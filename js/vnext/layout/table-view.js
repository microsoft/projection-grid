import _ from 'underscore';
import $ from 'jquery';
import Backbone from 'backbone';
import ListView from 'backbone-virtualized-listview';

import { HeaderView } from './header-view.js';

import rowTemplate from './row.jade';
import tableTemplate from './table.jade';
import columnGroupTemplate from './column-group.jade';

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

    this._headerView = new HeaderView({ tableView: this });
  }

  set(state = {}, callback = _.noop) {
    const isSet = key => !_.isUndefined(state[key]);
    const listState = {};

    _.extend(this._state, _.pick(state, STATE_OPTIONS));

    if (_.some(ITEMS_OPTIONS, isSet)) {
      listState.items = getItems(_.pick(this._state, ITEMS_OPTIONS));
    }
    if (isSet('events')) {
      listState.events = this._state.events;
    }

    this._listView.set(listState, callback);

    if (this.$colgroup) {
      this.$colgroup.html(columnGroupTemplate(this._state));
    }

    if (this._headerView) {
      this._headerView.redraw();
    }

    if (this.$stickyHeader) {
      this._adjust();
    }

    return this;
  }

  render(callback = _.noop) {
    this.$el.html(this._listView.render(() => {
      this.$colgroup = this.$('colgroup.column-group');
      this.$colgroup.html(columnGroupTemplate(this._state));

      this._headerView.setElement(this.$('thead.header'));
      this._headerView.render();

      this.$tableContainer = this.$('.table-container');

      if (this._props.stickyHeader) {
        this.$stickyHeader = this.$('.sticky-header');
        this._listView.viewport.on('change', () => this._adjust());
        this._adjust();
      }
      callback();
    }).el);

    return this;
  }

  _adjust() {
    let topVP = this._listView.viewport.getMetrics().outer.top;
    let offset = _.result(this._props.stickyHeader, 'offset', 0);
    let topCur = this.$tableContainer.get(0).getBoundingClientRect().top;

    this.$stickyHeader.css({ top: Math.max(topVP + offset - topCur, 0) });
  }

  remove() {
    this._headerView.remove();
    this._listView.remove();
    super.remove();
  }

  scrollToItem(...args) {
    this._listView.scrollToItem(...args);
  }

  indexOfElement(el) {
    const $elTr = this._listView.$(el).closest('tr', this._listView.$container);
    if ($elTr.length > 0) {
      return $elTr.index() + this._listView.indexFirst;
    }
    return null;
  }

}

