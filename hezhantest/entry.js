var pGrid = require('../js');
var memoryData = require('./people.json').value;
var tmpl = require('./testTmpl.jade');

var gridConfig = {
  el: '#container',
  dataSource: {
    type: 'memory',
    data: memoryData,
    primaryKey: 'UserName',
  },
  columns: [{
    name: 'UserName',
    title: 'User Name',
    sortable: true,
    locked: true,
  }, {
    name: 'FirstName',
    title: 'First Name',
    editable: true,
    colClasses: ['nameClass1', 'nameClass2'],
    headerClasses: ['nameHeaderClass1', 'nameHeaderClass2'],
    bodyClasses: ['nameBodyClass1', 'nameBodyClass2'],
  }, {
    name: 'LastName',
    title: 'Last Name',
    editable: true,
    colClasses: ['nameClass1', 'nameClass2'],
    headClasses: ['nameHeaderClass1', 'nameHeaderClass2'],
    bodyClasses: ['nameBodyClass1', 'nameBodyClass2'],
  }, {
    name: 'Address',
    property: 'AddressInfo/0/Address',
    template: tmpl,
  }, {
    name: 'Gender',
    html: '<i>Gender</i>',
  }, {
    name: 'Concurrency',
    hidden: true,
  }]
};

var pgrid = pGrid
  .factory({vnext: true})
  .create(gridConfig);
var gridView = pgrid.gridView.render();
