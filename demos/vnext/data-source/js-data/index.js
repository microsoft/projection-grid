import pgrid from '../../../../js';
import store from './js-data-resource.js';
import Editor from '../../../../js/vnext/editor-plugin.js';
import './index.less';
import 'bootstrap-webpack';

window.gridView = pgrid.factory({ vnext: true }).use(Editor).create({
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
  columns: [{
    name: 'UserName',
  },{
    name: 'FirstName',
  },{
    name: 'LastName',
  },{
    name: 'Emails',
  },{
    name: 'Gender',
  }],
  /*
  query: {
    skip: 2,
    take: 5,
  },
  */
  plugin: {
    editableColumns: [{
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
  },
}).gridView.render();
