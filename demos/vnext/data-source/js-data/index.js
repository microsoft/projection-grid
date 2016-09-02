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
    primaryKey: 'UserName',
  },
  editableOption: false,
  columns: [{
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
  }],
  /*
  query: {
    skip: 2,
    take: 5,
  },
  */
}).gridView.render();
