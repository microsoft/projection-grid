import Backbone from 'backbone';
import pgrid from '../../../js';

import './index.less';
import 'bootstrap-webpack';


window.gridView = pgrid.factory({ vnext: true }).create({
  el: '.grid-container',
  viewport: '.grid-container',
  stickyHeader: true,
  virtualized: true,
  dataSource: {
    type: 'odata',
    url: 'http://services.odata.org/V4/Northwind/Northwind.svc/Orders',
    primaryKey: 'OrderID',
  },
  selection: true,
  rows: {
    bodyRows: [
      {
        name: 'data-rows',
        classes: {
          redColor: true,
          longer: (row) => { return row.ShipAddress.length > 15; }, 
        }
      }
    ],
  },
  columns: [{
    name: 'Group 0',
    html: '<i>Group 0</i>',
    columns: [{
      name: 'CustomerID',
      sortable: true,
      editable: true,
    },{
      name: 'OrderID',
      sortable: -1,
    }, {
      name: 'ShipAddress',
      property: 'ShipAddress/length',
      title: 'Ship Address Length',
      width: 150, 
      sortable: 'length(ShipAddress)',
    }, {
      name: 'Destination',
      property: ({ item }) => `${item.ShipCountry} / ${item.ShipCity}`,
    }],
  },{
    name: 'ShipCity',
    sortable: true,
  }],
  events: {
    'click th.column-header': (e) => console.log(e.target),
  }, 
}).gridView.render();
