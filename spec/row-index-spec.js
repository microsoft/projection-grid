var expect = require('chai').expect;
var RowIndex = require('component/grid/projection/row-index');
var Base = require('component/grid/projection/base');
var Response = require('component/grid/model/response');

describe('projection RowIndex', function () {
  it('update should run normal', function () {
    var model = new RowIndex();

    var originalData = new Base();
    originalData.data = new Response({
      value: [
        { name: 'hello', id: 'hello_id' },
        { name: 'world', id: 'world_id' },
      ],
    });

    originalData.pipe(model);
    expect(model.data.get('value')[0].rowIndex).to.be.equal(1);
    expect(model.data.get('value')[1].rowIndex).to.be.equal(2);
  });
});
