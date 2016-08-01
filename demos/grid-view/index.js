import _ from 'underscore';
import $ from 'jquery';
import Backbone from 'backbone';

import { GridView } from '../../js/vnext/grid-view.js';
import bodyTemplate from './body-template.jade';
import store from './js-data-resource.js';

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

const headTemplate = _.template('<i><span><%= name%></span></i>');

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
      headTemplate: headTemplate,
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
    type: 'jsdata',
    entity: store,
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

