var expect = require('chai').expect;
var sinon = require('sinon');
var EditableProjection = require('component/grid/projection/editable');
var Base = require('component/grid/projection/base');
var Response = require('component/grid/model/response');

describe('projection editable', function () {
  it('receive array editable config', function () {
    var model = new EditableProjection({
      'column.editable': ['name', 'age'],
    });

    var originalData = new Base();
    originalData.data = new Response({
      value: [{ name: 'hello', age: 11, id: 12 }],
      columns: {},
    });
    sinon.spy(model, 'patch');
    originalData.pipe(model);
    expect(model.patch.called).to.be.true;

    expect(Object.keys(model.viewConfig)).to.be.eql(['name', 'age']);
  });

  it('receive object editable config', function () {
    var model = new EditableProjection({
      'column.editable': {
        name: sinon.spy(),
        age: sinon.spy(),
      },
    });

    var originalData = new Base();
    originalData.data = new Response({
      value: [{ name: 'hello', age: 11, id: 12 }],
      columns: {},
    });
    sinon.spy(model, 'patch');
    originalData.pipe(model);
    expect(model.patch.called).to.be.true;

    expect(Object.keys(model.viewConfig)).to.be.eql(['name', 'age']);
  });
});
