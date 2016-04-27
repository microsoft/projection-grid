var pgrid = require('projection-grid');
var Customer = require('./js-data-resource');
var keyHeaderTemplate = require('./key-column-header.jade');
var companyNameTemplate = require('./company-name.jade');
var pagerViewPlugin = require('./pager-view-plugin').default;
require('bootstrap-webpack');

var grid = pgrid.factory().use(pagerViewPlugin).create({
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
  pageable: {
    pageSize: 10,
    pageSizes: [5, 10, 15, 20],
  },
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
  pagerView: {
    el: '.pager-root',
    availablePageSizes: [5, 10, 15, 20],
  },
});

// jsdata.on('update:beginning', function () {
//   console.log('begin update');
// });
//
// jsdata.on('update:finished', function () {
//   console.log('end update');
// });

grid.gridView.render({ fetch: true });
grid.pagerView.render();
