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
  editableOption: true,
  columns: [{
    name: '__primary_key__',
    bodyClasses: 'primaryKey',
   },{
    name: 'UserName',
    editable: true,
  },{
    name: 'FirstName',
    editable: true,
  },{
    name: 'LastName',
    editable: true,
  },{
    name: 'Emails',
    editable: true,
  },{
    name: 'Gender',
    editable: true,
  },{
    name: 'Concurrency',
  }],
}).gridView.render();
