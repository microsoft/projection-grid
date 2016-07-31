import _ from 'underscore';
import $ from 'jquery';
import Backbone from 'backbone';

import { GridView } from '../../js/vnext/grid-view.js';
import bodyTemplate from './body-template.jade';

import './index.less';
import 'bootstrap-webpack';

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


window.gridViewEl = new GridView({
  el: '.container-element-viewport',
  viewport: '.container-element-viewport',
  stickyHeader: true,
  virtualized: true,
}).set({
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
      bodyTemplate: bodyTemplate,
    },{
      name: 'OrderID',
    }], 
  },{
    name: 'ShipCity',
  }],
}).render();

window.gridViewWin = new GridView({
  el: '.container-window-viewport',
  stickyHeader: {
    offset() {
      return $('.navbar-container').height();
    },
  },
  virtualized: true,
}).set({
  dataSource: {
    type: 'odata',
    url: 'http://services.odata.org/V4/Northwind/Northwind.svc/Orders',
  },
  selection: { single: true },
  rows: {
    headRows: [{
      view: window.customView,
    },
    'column-header-rows',
    ],
  },
}).render();

