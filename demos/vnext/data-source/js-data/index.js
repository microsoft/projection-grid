import pgrid from '../../../../js';
import store from './js-data-resource.js';

import './index.less';
import 'bootstrap-webpack';

window.gridView = pgrid.factory({ vnext: true }).create({
  el: '.grid-container',
  tableClasses: ['table', 'table-bordered'],
  scrolling: {
    virtualized: true,
  },
  dataSource: {
    type: 'js-data',
    entity: store,
  },
  columns: [{
    name: 'UserName',
  },{
    name: 'FirstName',
  },{
    name: 'LastName',
  },{
    name: 'Emails',
  },{
    name: 'AddressInfo',
  },{
    name: 'Gender',
  },{
    name: 'Concurrency',
  }],
  /*
  query: {
    skip: 2,
    take: 5,
  },
  */
}).gridView.render();
