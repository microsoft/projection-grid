import _ from 'underscore';
import Backbone from 'backbone';
import ListView from 'backbone-virtualized-listview';

import { HeaderView, FooterView } from './header-footer-view.js';

import rowTemplate from './row.jade';
import tableFixedTemplate from './table-fixed.jade';
import tableStaticTemplate from './table-static.jade';
import tableStickyTemplate from './table-sticky.jade';

import columnGroupTemplate from './column-group.jade';

const STATE_OPTIONS = ['cols', 'headRows', 'bodyRows', 'footRows', 'events'];
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

    this._listView = new ListView({
      el: this.$el,
      virtualized: this._props.scrolling.virtualized,
      viewport: this._props.scrolling.viewport,
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
    const scrolling = { viewport, virtualized };

    scrolling.header = this._normalizeHeaderConfig(header);

    if (scrolling.header.type === 'fixed') {
      scrolling.viewport = '.viewport';
    }

    return scrolling;
  }

  get headerType() {
    return this._props.scrolling.header.type;
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
      listState.events = state.events;
    }

    this._renderColumnGroup();

    if (this._headerView) {
      this._headerView.redraw();
    }

    if (this._footerView) {
      this._footerView.redraw();
    }

    this._listView.set(listState, callback);

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

  _renderFooter() {
    this._footerView.setElement(this.$('tfoot.footer'));
    this._footerView.render();
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
    this._listView.set({
      listTemplate: tableStaticTemplate,
      itemTemplate: rowTemplate,
    }).render(() => {
      this._renderColumnGroup();
      this._renderHeader();
      this._renderFooter();
      callback();
    });
  }

  _renderFixed(callback) {
    this._listView.set({
      listTemplate: tableFixedTemplate,
      itemTemplate: rowTemplate,
    }).render(() => {
      this._renderColumnGroup();
      this._renderHeader();
      this._renderFooter();
      callback();
    });

    this._listView.on('didRedraw', () => {
      const widthViewport = this.$('.viewport').get(0).clientWidth;
      const widthContainer = this.el.clientWidth;
      const widthScrollbar = widthContainer - widthViewport;
      const widthTable = this.$('.viewport > table').get(0).offsetWidth;

      this.$el.width(widthTable + widthScrollbar);
      this.$('.fixed-header').width(widthTable);
    });
  }

  _renderSticky(callback) {
    this._listView.set({
      listTemplate: tableStickyTemplate,
      itemTemplate: rowTemplate,
    }).render(() => {
      this._renderColumnGroup();
      this._renderHeader();
      this._hookUpStickyHeader(this._listView);
      this._renderFooter();
      callback();
    });
  }

  render(callback = _.noop) {
    const header = this._props.scrolling.header;

    switch (header.type) {
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

    if (this._listView) {
      this._listView.remove();
    }

    if (this._footerView) {
      this._footerView.remove();
    }

    super.remove();
  }

  scrollToItem(...args) {
    this._listView.scrollToItem(...args);
  }

  indexOfElement(el) {
    const $elTr = this._listView.$(el).closest('tr', this._listView.$container);
    if ($elTr.length > 0) {
      return $elTr.index() + this._listView.indexFirst - 1;
    }
    return null;
  }

}
