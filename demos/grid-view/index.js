import _ from 'underscore';
import $ from 'jquery';
import Backbone from 'backbone';

import pgrid from '../../js';
import bodyTemplate from './body-template.jade';
import store from './js-data-resource.js';
import people from 'json!./people.json';

import './index.less';
import 'bootstrap-webpack';

console.log(people.value);
class CustomView extends Backbone.View {
  events() {
    return {
      'click h2': () => console.log('click'),
    };
  }
  render() {
    this.$el.html('<h2>Custom View</h2>');
    return this;
  }
}

window.customView = new CustomView().render();

window.gridViewEl = pgrid.factory({ vnext: true }).create({
  el: '.container-element-viewport',
  viewport: '.container-element-viewport',
  stickyHeader: true,
  virtualized: true,
  dataSource: {
    type: 'odata',
    url: 'http://services.odata.org/V4/Northwind/Northwind.svc/Orders',
  },
  selection: true,
  columns: [{
    name: 'Group 0',
    html: '<i>Group 0</i>',
    columns: [{
      name: 'CustomerID',
      template: bodyTemplate,
      sortable: true,
    },{
      name: 'OrderID',
      sortable: true,
    }, {
      name: 'ShipAddressLength',
      field: 'ShipAddress/length',
      title: 'Ship Address Length',
      sortable: true,
    }, {
      name: 'Destination',
      value: item => `${item.Country}/${item.City}`,
      sortable: true,
    }],
  },{
    name: 'ShipCity',
    sortable: true,
  }],
  events: {
    'click th.column-header': (e) => console.log(e.target),
  },
}).gridView.render();

window.gridViewWin = pgrid.factory({ vnext: true }).create({
  el: '.container-window-viewport',
  stickyHeader: {
    offset() {
      return $('.navbar-container').height();
    },
  },
  virtualized: true,
  dataSource: {
    //type: 'jsdata',
    //entity: store,
    type: 'memory',
    data: people.value,
  },
  selection: { single: true },
  rows: {
    headRows: [{
      view: window.customView,
    },
    'column-header-rows',
    ],
  },
}).gridView.render();

