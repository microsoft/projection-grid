import Backbone from 'backbone';
import columnGroupTemplate from './column-group.jade';

export class ColumnGroupView extends Backbone.View {
  initialize({ tableView }) {
    this.tableView = tableView;
  }

  redraw() {
    this.$el.html(columnGroupTemplate({ cols: this.tableView._state.cols }));
  }

  render() {
    this.redraw();
    return this;
  }
}
