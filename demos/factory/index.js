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
    schema: { key: 'CustomerID' },
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
      editable: true,
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
      editable: true,
      headerBuilder: (column => 'Great ' + column.property),
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

grid.gridView.on('update:beginning', function () {
  console.log('begin update');
});

grid.gridView.on('update:finished', function (error) {
  if (error) {
    console.log('fail update');
  } else {
    console.log('success update');
  }
});

grid.gridView.on('data:edit', model => {
  console.log(`[Edit] ${JSON.stringify(model)}`);
});

grid.gridView.render({ fetch: true });
grid.pagerView.render();
