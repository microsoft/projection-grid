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
  // columnShifter: true,
  selectable: true,
  columns: [
    {
      field: 'CustomerID',
      title: 'Customer ID',
      sortable: true,
      locked: true,
      headerTemplate: keyHeaderTemplate,
    },
    {
      field: 'CompanyName',
      title: 'Company Name',
      sortable: true,
      template: companyNameTemplate,
    },
    {
      field: 'City',
      title: 'City',
      sortable: true,
    },
    {
      field: 'ContactName',
      title: 'Contact Name',
      sortable: true,
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
