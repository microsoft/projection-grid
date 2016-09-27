import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import pgrid from '../../../js';

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
  selection: true,
}).gridView.render();

gridView.on('willReload', () => {
  console.log('Will reload');
});

gridView.on('didReload', () => {
  console.log('Did reload');
});

gridView.on('willRedraw', () => {
  console.log('Will redraw');
});

gridView.on('didRedraw', () => {
  console.log('Did redraw');
});

gridView.on('willUpdate', (changes) => {
  console.log(`Will update with changes ${_.keys(changes)}`);
});

gridView.on('didUpdate', (changes) => {
  console.log(`Did update with changes ${_.keys(changes)}`);
});

gridView.on('willSelect', (selections) => {
  console.log(`Will select ${selections[0]}`);
});

gridView.on('didSelect', (selections) => {
  console.log(`Did select ${selections[0]}`);
});

