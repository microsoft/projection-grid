var pgrid = require('projection-grid');
var Customer = require('./js-data-resource');
var keyHeaderTemplate = require('./key-column-header.jade');
var companyNameTemplate = require('./company-name.jade');
require('bootstrap-webpack');

var grid = pgrid.factory().create({
  el: '.grid-root',
  dataSource: {
    type: 'js-data',
    resource: Customer,
  },
  scrollable: {
    virtual: true,
  },
  columnShifter: {
    totalColumns: 3,
  },
  selectable: true,
  columns: [
    {
      name: 'CustomerID',
      title: 'Customer ID',
      sortable: true,
      locked: true,
      headerTemplate: keyHeaderTemplate,
    },
    {
      name: 'CompanyName',
      title: 'Company Name',
      sortable: true,
      template: companyNameTemplate,
    },
    {
      name: 'City',
      title: 'City',
      sortable: true,
    },
    {
      name: 'ContactName',
      title: 'Contact Name',
      sortable: true,
    },
    {
      name: 'ContactTitle',
    },
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
