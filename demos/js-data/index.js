var pgrid = require('projection-grid');
var Customer = require('./js-data-resource');

var jsdata = new pgrid.projections.JSData({
  'jsdata.entity': Customer,
});
var projection = jsdata.pipe(
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

jsdata.on('update:beginning', function () {
  console.log('begin update');
});

jsdata.on('update:finished', function () {
  console.log('end update');
});

grid.render({ fetch: true });
