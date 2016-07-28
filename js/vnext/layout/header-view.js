import Backbone from 'backbone';
import headerTemplate from './header.jade';

export class HeaderView extends Backbone.View {
  initialize({ tableView }) {
    this.tableView = tableView;
  }

  redraw() {
    this.$el.html(headerTemplate({ rows: this.tableView._state.headRows }));
  }

  render() {
    this.redraw();
    return this;
  }
}
