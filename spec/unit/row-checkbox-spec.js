var expect = require('chai').expect;
var RowCheckbox = require('component/grid/projection/row-checkbox');
var Base = require('component/grid/projection/base');
var Response = require('component/grid/model/response');

describe('projection RowCheckbox', function () {
  it('update should run normal', function () {
    var model = new RowCheckbox({
      'row.check.id': 'id',
      'column.checked': 'name',
    });

    var originalData = new Base();
    originalData.data = new Response({
      value: [
        { name: 'hello', id: 'hello_id' },
        { name: 'world', id: 'world_id' },
      ],
      columns: [
        { name: 'hello', property: 'name' },
        { id: 'hello_id', property: 'id' },
      ],
    });

    originalData.pipe(model);
    expect(model.data.get('value')[0].name.$html).to.be.not.null;
    expect(model.data.get('value')[1].name.$html).to.be.not.null;
  });

  it('thClick should run normal', function () {
    var model = new RowCheckbox({
      'row.check.id': 'id',
      'column.checked': 'name',
      'row.check.allow': true,
    });
    model.data = new Response({
      value: [
        { name: 'hello', id: 'hello_id' },
        { name: 'world', id: 'world_id' },
      ],
    });
    model.thClick({}, { property: 'name', checked: true });
    expect(model.get('row.check.list')).to.be.eql(['hello_id', 'world_id']);
  });

  it('tdClick should run normal', function () {
    var model = new RowCheckbox({
      'row.check.id': 'id',
      'column.checked': 'name',
      'row.check.list': [],
    });
    var newModel = new Response({ name: 'hello', id: 'hello_id' });
    model.tdClick({}, { property: 'name', model: newModel, checked: true });

    expect(model.get('row.check.list')).to.be.eql(['hello_id']);
  });
});
