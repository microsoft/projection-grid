import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import pgrid from '../../../../js';

import './index.less';
import 'bootstrap-webpack';

window.gridView = pgrid.factory({ vnext: true }).create({
  el: '.grid-container',
  tableClasses: ['table', 'table-bordered'],
  scrolling: {
    virtualized: true,
    header: {
      type: 'sticky',
      offset() {
        return $('.navbar-container').height();
      },
    },
  },
  dataSource: {
    type: 'odata',
    url: 'http://services.odata.org/V4/Northwind/Northwind.svc/Orders',
    primaryKey: 'OrderID',
  },
  selection: {
    single: true,
    selectable(item) {
      return _.has(item, 'CustomerID') && item.CustomerID.match(/^[A-N]/);
    },
    colClasses: ['selection-column'],
    headClasses: ['selection-header'],
    bodyClasses: ['selection-cell'],
  },
}).gridView.render();

gridView.on('willSelect', (selections) => {
  console.log(`Will select ${selections[0]}`);
});

gridView.on('didSelect', (selections) => {
  console.log(`Did select ${selections[0]}`);
});

