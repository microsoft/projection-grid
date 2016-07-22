import _ from 'underscore';
import Backbone from 'backbone';
import VirtualizedListView from 'backbone-virtualized-listview';

import ListView from './list-view.js';
import tableTemplate from './table.jade';
import rowTemplate from './row.jade';

const getLeafColumns = columns => {
  return _.chain(columns).map(column => {
    if (column.columns) {
      return getLeafColumns(column.columns);
    } else {
      return column;
    }
  }).flatten().value();
};

class TableView extends Backbone.View {
  initialize({
    virtualize = false,
    columns,
    rows,
  }) {
    this.virtualize = virtualize;
    this.columns = columns;
    this.rows = rows;
    const listTemplate = () => tableTemplate({ header: '' });
    const itemTemplate = item => rowTemplate({
      columns,
      leafColumns: getLeafColumns(columns),
      item,
    });


    this.listView = virtualize ? new VirtualizedListView({
      el: this.$el,
      listTemplate,
      itemTemplate,
      items: rows,
    }) : new ListView({
      el: this.$el,
      listTemplate,
      itemTemplate,
      items: rows,
    });
  }

  render() {
    this.listView.render();
    return this;
  }

  scrollToItem(...args) {
    this.listView.scrollToItem(...args);
  }
}

export default TableView;

