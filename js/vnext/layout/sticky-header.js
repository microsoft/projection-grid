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

  _redraw() {
    this.undelegateEvents();

    this._columnGroupView.redraw();
    this._headerView.redraw();

    this.delegateEvents(this.tableView._state.events);
  }

  _adjust() {
    const listView = this.tableView._listView;
    const viewport = listView.viewport;
    const metricsVP = viewport.getMetrics();
    const rectVP = metricsVP.outer;
    const rectTable = listView.$('table').get(0).getBoundingClientRect();
    const offset = _.result(this.tableView._props.stickyHeader, 'offset', 0);
    const stickyTop = rectVP.top + offset;
    const isWindow = viewport.$el.get(0) === window;

    if (rectTable.top < stickyTop) {
      let left = rectTable.left;
      let top = stickyTop;

      this.$el.show();
      if (!isWindow) {
        // If we are using the absolute postion
        //  * Add the left/top scroll offset
        //  * Minus the left/top of the offset parent
        const elOffsetParent = this.el.offsetParent || document.documentElement;
        const rectParent = elOffsetParent.getBoundingClientRect();
        left += metricsVP.scroll.x - rectParent.left;
        top += metricsVP.scroll.y - rectParent.top;
      }

      this.$el.css({ left, top });
    } else {
      this.$el.hide();
    }
  }

  render() {
    const listView = this.tableView._listView;
    const viewport = listView.viewport;
    const isWindow = viewport.$el.get(0) === window;
    const $elViewport =  isWindow ? $(document.body) : viewport.$el;

    this.$el.html(stickyHeaderTemplate());
    this._columnGroupView.setElement(this.$('colgroup'));
    this._headerView.setElement(this.$('thead'));

    this._redraw();
    $elViewport.prepend(this.el);

    if (!isWindow) {
      $elViewport.css({ position: 'relative' });
    }

    this.$el.css({
      position: isWindow ? 'fixed' : 'absolute',
      display: 'none',
    });

    listView.once('didRedraw', () => {
      viewport.on('change', () => this._adjust());
    });

    return this;
  }

  remove() {
    this._columnGroupView.remove();
    this._headerView.remove();
    super.remove();
  }
}

