import pgrid from '../../../../js';
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
    type: 'odata',
    url: 'http://services.odata.org/V4/Northwind/Northwind.svc/Orders',
    primaryKey: 'OrderID',
  },
  columns: [{
    name: 'OrderID',
  },{
    name: 'CustomerID',
  },{
    name: 'EmployeeID',
  },{
    name: 'OrderDate',
  },{
    name: 'RequiredDate',
  },{
    name: 'ShippedDate',
  },{
    name: 'ShipVia',
  },{
    name: 'Freight',
  },{
    name: 'ShipName',
  },{
    name: 'ShipAddress',
  },{
    name: 'ShipCity',
  },{
    name: 'ShipRegion',
  },{
    name: 'ShipPostalCode',
  },{
    name: 'ShipCountry',
  }],
  plugin: {
    editableColumns: [{
      name: 'ShipName',
    }],
  },
}).gridView.render();
