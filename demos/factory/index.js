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
  aggregate: {
    top(/* data */) {
      return [
        { CustomerID: 'Total Top' },
      ];
    },
    bottom(/* data */) {
      return [
        { CustomerID: 'Total Bottom' },
      ];
    },
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
      attributes: {
        class: 'company-name-cell',
      },
      headerAttributes: {
        class: 'company-name-header',
      },
    },
    {
      name: 'City',
      title: 'City',
      sortable: true,
    },
    {
      name: 'Contact',
      field: 'ContactName',
      value: item => `${item.ContactName} (${item.ContactTitle})`,
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
