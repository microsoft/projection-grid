var pgrid = require('projection-grid');
var Customer = require('./js-data-resource').default;
var keyHeaderTemplate = require('./key-column-header.jade');
var companyNameTemplate = require('./company-name.jade');
var MapView = require('./map-view').default;

require('bootstrap-webpack');
require('style!css!./index.css');

var grid = pgrid.factory().create({
  el: '.grid-root',
  dataSource: {
    type: 'js-data',
    resource: Customer,
    schema: { key: 'CustomerID' },
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
      View: MapView,
    },
    {
      name: 'Contact',
      field: 'ContactName',
      value: item => `${item.ContactName} (${item.ContactTitle})`,
      sortable: true,
    },
  ],
});

grid.gridView.render({ fetch: true });
