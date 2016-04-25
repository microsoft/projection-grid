var pgrid = require('projection-grid');

var odata = new pgrid.projections.Odata({
  url: 'http://services.odata.org/V4/Northwind/Northwind.svc/Customers',
});

var projection = odata.pipe(
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

odata.on('update:beginning', function () {
  console.log('begin update');
});

odata.on('update:finished', function () {
  console.log('end update');
});

grid.render({ fetch: true });
