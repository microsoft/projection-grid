import _ from 'underscore';
import $ from 'jquery';
import Backbone from 'backbone';
import ListView from 'backbone-virtualized-listview';
import Promise from 'bluebird';

import { HeaderView, FooterView } from './header-footer-view.js';

import rowTemplate from './row.jade';
import tableFixedOuterTemplate from './table-fixed-outer.jade';
import tableFixedInnerTemplate from './table-fixed-inner.jade';
import tableStaticTemplate from './table-static.jade';
import tableStickyTemplate from './table-sticky.jade';

import columnGroupTemplate from './column-group.jade';

const STATE_OPTIONS = ['cols', 'headRows', 'bodyRows', 'footRows', 'events'];
const MODEL_OPTIONS = ['cols', 'headRows', 'footRows'];
const ITEMS_OPTIONS = ['bodyRows'];
const HEADER_OPTIONS = ['cols', 'headRows', 'events'];

const HEADER_TYPES = ['static', 'fixed', 'sticky'];


export class TableView extends Backbone.View {
  initialize({ scrolling = {} }) {
    this._props = {
      scrolling: this._normalizeScrollingConfig(scrolling),
    };

    this._state = {
      cols: [],
      headRows: [],
      bodyRows: [],
      footRows: [],
      events: {},
    };

    this.p$listView = new Promise((resolve, reject) => {
      this._resolveViewport = viewport => {
        const scrolling = this._props.scrolling;
        const virtualized = scrolling.virtualized;

        resolve(new ListView({ virtualized, viewport }));
      };
      this._rejectListView = () => {
        reject(new Error('List view is not initailized'));
      };
    });

    this._headerView = new HeaderView({ tableView: this });
    this._footerView = new FooterView({ tableView: this });
  }

  _normalizeHeaderConfig(config) {
    const header = {};

    if (_.isString(config)) {
      header.type = config;
    } else if (_.isFunction(config) || _.isFinite(config)) {
      header.type = 'sticky';
      header.offset = config;
    } else if (_.isObject(config) && _.isString(config.type)) {
      _.extend(header, _.pick(config, 'type', 'offset'));
    }

    if (!_.contains(HEADER_TYPES, header.type)) {
      header.type = 'static';
    }

    if (header.type === 'sticky' && !_.isFinite(_.result(header, 'offset'))) {
      header.offset = 0;
    }

    return header;
  }

  _normalizeScrollingConfig({
    viewport,
    virtualized = false,
    header = 'static',
  }) {
    const scrolling = { virtualized };

    scrolling.header = this._normalizeHeaderConfig(header);

    if (scrolling.header.type === 'fixed') {
      scrolling.viewport = () => this.$('tbody.list-container');
    }

    return scrolling;
  }


  set(state = {}, callback = _.noop) {
    const isSet = key => !_.isUndefined(state[key]);
    const listState = {};

    _.extend(this._state, _.pick(state, STATE_OPTIONS));

    if (isSet('bodyRows')) {
      const bodyRows = this._state.bodyRows;

      listState.items = {
        length: bodyRows.length,
        slice(start, stop) {
          return _.map(bodyRows.slice(start, stop), row => ({ row }));
        },
      };
    }

    if (isSet('events')) {
      listState.events = this._state.events;
    }

    this._renderColumnGroup();

    if (this._headerView) {
      this._headerView.redraw();
    }

    if (this._footerView) {
      this._footerView.redraw();
    }

    this.p$listView.then(listView => listView.set(listState, callback));

    return this;
  }

  _renderColumnGroup() {
    this.$colgroup = this.$('colgroup.column-group');
    this.$colgroup.html(columnGroupTemplate(this._state));
  }

  _renderHeader() {
    this._headerView.setElement(this.$('thead.header'));
    this._headerView.render();
  }

  _hookUpStickyHeader(listView) {
    const $tableContainer = this.$('.table-container');
    const $stickyHeader = this.$('.sticky-header');
    const adjustStickyHeader = () => {
      let topVP = listView.viewport.getMetrics().outer.top;
      let offset = _.result(this._props.scrolling.header, 'offset', 0);
      let topCur = $tableContainer.get(0).getBoundingClientRect().top;

      $stickyHeader.css({ top: Math.max(topVP + offset - topCur, 0) });
    };

    listView.viewport.on('change', adjustStickyHeader);
    listView.on('didRedraw', adjustStickyHeader);
  }

  _renderStatic(callback) {
    this._resolveViewport(this._props.scrolling.viewport);
    this.p$listView.then(listView => {
      this.$el.html(listView.set({
        listTemplate: tableStaticTemplate,
        itemTemplate: rowTemplate,
      }).render(() => {
        this._renderColumnGroup();
        this._renderHeader();
      }).el);
    });
  }

  _renderFixed(callback) {
    this.$el.html(tableFixedOuterTemplate());

    const $viewport = this.$('.viewport');

    this._resolveViewport($viewport);

    this.p$listView.then(listView => {
      $viewport.html(listView.set({
        listTemplate: tableFixedInnerTemplate,
        itemTemplate: rowTemplate,
      }).render(() => {
        this._renderColumnGroup();
        this._renderHeader();
      }).el);
    });
  }

  _renderSticky(callback) {
    this._resolveViewport(this._props.scrolling.viewport);
    this.p$listView.then(listView => {
      this.$el.html(listView.set({
        listTemplate: tableStickyTemplate,
        itemTemplate: rowTemplate,
      }).render(() => {
        this._renderColumnGroup();
        this._renderHeader();
        this._hookUpStickyHeader(listView);
      }).el);
    });
  }

  render(callback = _.noop) {
    if (!this.p$listView.isPending()) {
      throw new Error('Should not access listView before render');
    }

    const header = this._props.scrolling.header;

    switch(header.type) {
      default:
      case 'static':
        this._renderStatic(callback);
        break;
      case 'fixed':
        this._renderFixed(callback);
        break;
      case 'sticky':
        this._renderSticky(callback);
        break;
    }

    return this;
  }

  remove() {
    if (this._headerView) {
      this._headerView.remove();
    }

    if (this.p$listView.isFulfilled()) {
      this.p$listView.value().remove();
    } else {
      this._rejectListView();
    }

    if (this._footerView) {
      this._footerView.remove();
    }

    super.remove();
  }

  scrollToItem(...args) {
    this.p$listView.then(listView => listView.scrollToItem(...args));
  }

  indexOfElement(el) {
    if (this.p$listView.isFulfilled()) {
      const listView = this.p$listView.value();
      const $elTr = listView.$(el).closest('tr', listView.$container);
      if ($elTr.length > 0) {
        return $elTr.index() + listView.indexFirst;
      }
    }
    return null;
  }

}

