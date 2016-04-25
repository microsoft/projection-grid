var pgrid = require('projection-grid');
// var PaginationView = require('pagination-control').PaginationView;
var Customer = require('./js-data-resource');

Customer.findAll({
  offset: 10,
  limit: 10,
}).then(console.log.bind(console));

var projection = new pgrid.projections.JSData({
  'jsdata.entity': Customer,
}).pipe(
  new pgrid.projections.ColumnI18n()
).pipe(new pgrid.projections.ColumnQueryable({
  'column.take': 10,
}));

var grid = new pgrid.GridView({
  el: '.grid-root',
  projection: projection,
  Layout: pgrid.layout.TableLayout.partial({
    template: pgrid.layout.templates.table,
    renderers: [
      pgrid.layout.renderers.Virtualization,
    ],
    columns: {
      CustomerID: { sortable: true },
      CompanyName: { sortable: true },
      City: { sortable: true },
      ContactName: { sortable: true },
    },
  }),
});

grid.render({ fetch: true });
