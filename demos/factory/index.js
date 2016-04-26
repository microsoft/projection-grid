var pgrid = require('projection-grid');
var Customer = require('./js-data-resource');

var grid = pgrid.factory().create({
  el: '.grid-root',
  dataSource: {
    type: 'js-data',
    resource: Customer,
  },
  scrollable: {
    virtual: true,
  },
  columns: [
    { field: 'CustomerID', sortable: true },
    { field: 'CompanyName', sortable: true },
    { field: 'City', sortable: true },
    { field: 'ContactName', sortable: true },
  ],
}).gridView;

// jsdata.on('update:beginning', function () {
//   console.log('begin update');
// });
//
// jsdata.on('update:finished', function () {
//   console.log('end update');
// });

grid.render({ fetch: true });
