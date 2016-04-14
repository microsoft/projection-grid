var expect = require('chai').expect;
var ColumnQueryable = require('component/grid/projection/column-queryable');
var Base = require('component/grid/projection/base');
var Response = require('component/grid/model/response');

describe('projection ColumnQueryable', function () {
  it('update should run normal', function () {
    var model = new ColumnQueryable({
      'column.take': 2,
      'column.skip': 1,
      'column.lock': ['name'],
    });

    var originalData = new Base();
    originalData.data = new Response({
      columns: [
        { name: 'hello', property: 'name' },
        { id: '007', property: 'id' },
        { attr1: '007', property: 'attr1' },
        { attr2: '007', property: 'attr2' },
      ],
    });
    originalData.pipe(model);
    expect(model.data.get('columns')[0].$lock).to.be.equal(true);
    expect(model.data.get('columns').length).to.be.equal(2);

    expect(model.data.get('column.skip')).to.be.equal(1);
    expect(model.data.get('columns.skipped')).to.be.eql(['id']);
    expect(model.data.get('columns.remaining')).to.be.eql(['attr2']);
  });
});
