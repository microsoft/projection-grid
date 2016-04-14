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
    });
    var originalData = new Base();
    originalData.data = new Response({
      columns: [
        { name: 'hello', property: 'name' },
        { id: '007', property: 'id' },
      ],
    });
    originalData.pipe(model);
    expect(model.data.get('columns')[0].$text).to.be.equal('Name');
    expect(model.data.get('columns')[1].$text).to.be.equal('$id');
  });
});
