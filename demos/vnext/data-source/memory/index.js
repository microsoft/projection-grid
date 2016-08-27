import pgrid from '../../../../js';
import people from './people.json';

import './index.less';
import 'bootstrap-webpack';

window.gridView = pgrid.factory({ vnext: true }).create({
  el: '.grid-container',
  tableClasses: ['table', 'table-bordered'],
  scrolling: {
    virtualized: true,
  },
  dataSource: {
    type: 'memory',
    data: people.value,
    //primaryKey: 'UserName',
  },
   columns: [{
    name: '__primary_key__',
   },{
    name: 'UserName',
  },{
    name: 'FirstName',
    editable: true,
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
}).gridView.render();
