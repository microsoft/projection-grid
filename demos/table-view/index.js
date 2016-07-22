import _ from 'underscore';
import $ from 'jquery';
import TableView from '../../js/table-view.js';
import 'bootstrap-webpack';

const tableView = window.tableView = new TableView({
  columns: [{
    name: 'Foo'
  }, {
    name: 'Bar'
  }, {
    name: 'Group',
    columns: [{
      name: 'Tic',
    }, {
      name: 'Tac',
    }, {
      name: 'Toe',
    }]
  }],

  rows: _.chain(2000).range().map(i => ({
    Foo: i,
    Bar: (_.random(100) + i) % 100,
    Tic: (_.random(100) + i) % 100,
    Tac: (_.random(100) + i) % 100,
    Toe: (_.random(100) + i) % 100,
  })).value(),

  virtualize: true,
}).render();

$(() => tableView.$el.appendTo('body'));

