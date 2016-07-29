import _ from 'underscore';
import $ from 'jquery';
import { GridView } from '../../js/vnext/grid-view.js';
import './index.less';
import bodyTemplate from './body-template.jade';
import 'bootstrap-webpack';

window.gridViewEl = new GridView({
  el: '.container-element-viewport',
  viewport: '.container-element-viewport',
  stickyHeader: true,
  virtualized: true,
}).set({
  odata: {
    url: 'http://services.odata.org/V4/Northwind/Northwind.svc/Orders',
  },
  selection: true,
  columns: [{
    name: 'Group0',
    bodyTemplate: bodyTemplate,
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
  odata: {
    url: 'http://services.odata.org/V4/Northwind/Northwind.svc/Orders',
  },
  selection: { single: true },
}).render();

