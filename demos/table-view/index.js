import _ from 'underscore';
import $ from 'jquery';
import TableView from '../../js/table-view.js';
import 'bootstrap-webpack';

const tableView = window.tableView = new TableView({
  columns: [{
    name: 'Group 0',
    html: '<i>Group 0</i>',
    height: 2,
    columns: [{
      name: 'Index',
    }, {
      name: 'Column0',
    }],
  }, {
    name: 'Group 1',
    columns: [{
      name: 'Foo',
    }, {
      name: 'Bar',
    }, {
      name: 'Group 2',
      columns: [{
        name: 'Tic',
      }, {
        name: 'Tac',
      }, {
        name: 'Toe',
      }],
    }],
  }],

  headRows: [
    'column-header-rows',
    {
      classes: ['filter-row'],
      html: '<b>filter state</b>',
    },
    {
      classes: ['another-header-row'],
      item: {
        Foo: {
          classes: ['col-foo'],
          html: '<b>Foo</b>',
        },
        Bar: {
          classes: ['col-bar'],
          html: '<b>Bar</b>',
        },
      },
    },
  ],
  bodyRows: _.chain(2000).range().map(i => ({
    classes: ['body-row'],
    item: {
      Index: { html: i },
      Column0: { html: (_.random(100) + i) % 100 },
      Foo: { html: (_.random(100) + i) % 100 },
      Bar: { html: (_.random(100) + i) % 100 },
      Tic: { html: (_.random(100) + i) % 100 },
      Tac: { html: (_.random(100) + i) % 100 },
      Toe: { html: (_.random(100) + i) % 100 },
    },
  })).value(),

  scrolling: {
    virtualized: true,
  },
}).render();

$(() => tableView.$el.appendTo('body'));

