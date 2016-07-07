import pgrid from 'projection-grid';

const grid = pgrid.factory().create({
  el: '.grid-root',
  dataSource: {
    type: 'odata',
    url: 'http://services.odata.org/V4/Northwind/Northwind.svc/Customers',
  },
  columns: [
    { name: 'CustomerID', sortable: true },
    { name: 'CompanyName', sortable: true },
    { name: 'City', sortable: true },
    { name: 'ContactName', sortable: true },
  ],
});

grid.gridView.on('update:beginning', function () {
  console.log('begin update');
});

grid.gridView.on('update:finished', function () {
  console.log('end update');
});

grid.gridView.render({ fetch: true });
