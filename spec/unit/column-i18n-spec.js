var expect = require('chai').expect;
var ColumnI18n = require('component/grid/projection/column-i18n');
var Base = require('component/grid/projection/base');
var Response = require('component/grid/model/response');

describe('projection ColumnI18n', function () {
  it('update should run normal', function () {
    var model = new ColumnI18n({
      'column.i18n': {
        'name': 'Name',
        '': function (name) {
          return '$' + name;
        },
      },
      'subColumn.i18n': {
        name: 'SubName',
      },
    });
    var originalData = new Base();
    originalData.data = new Response({
      columns: {
        name: { name: 'hello', property: 'name' },
        id: { id: '007', property: 'id' },
      },
    });
    originalData.pipe(model);
    expect(model.data.get('columns').name.$text).to.be.equal('Name');
    expect(model.data.get('columns').name.config.subColTitle).to.be.equal('SubName');
    expect(model.data.get('columns').id.$text).to.be.equal('$id');
  });
});
