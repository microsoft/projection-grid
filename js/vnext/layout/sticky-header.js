import _ from 'underscore';
import $ from 'jquery';
import Backbone from 'backbone';
import { ColumnGroupView } from './column-group-view.js';
import { HeaderView } from './header-view.js';

import stickyHeaderTemplate from './sticky-header.jade';

export class StickyHeaderView extends Backbone.View {
  initialize({ tableView }) {
    this.tableView = tableView;
    this._columnGroupView = new ColumnGroupView({ tableView });
    this._headerView = new HeaderView({ tableView });
  }

  redraw() {
    this.undelegateEvents();

    this._columnGroupView.redraw();
    this._headerView.redraw();

    this.delegateEvents(this.tableView._state.events);
  }

  _adjust() {
    const listView = this.tableView._listView;
    const viewport = listView.viewport;
    const metricsVP = viewport.getMetrics();
    const topVP = metricsVP.outer.top;
    const offset = _.result(this.tableView._props.stickyHeader, 'offset', 0);
    const topHeader = this.tableView.$('.content').get(0).getBoundingClientRect().top - this.$el.height();

    this.$el.css({ top: Math.max(topVP + offset - topHeader, 0) });
  }

  render() {
    const listView = this.tableView._listView;
    const viewport = listView.viewport;

    this.$el.html(stickyHeaderTemplate());
    this.$el.css({ position: 'relative' });

    this._columnGroupView.setElement(this.$('colgroup'));
    this._headerView.setElement(this.$('thead'));

    this.redraw();

    viewport.on('change', () => this._adjust());

    return this;
  }

  remove() {
    this._columnGroupView.remove();
    this._headerView.remove();
    super.remove();
  }
}

