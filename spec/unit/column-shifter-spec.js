var expect = require('chai').expect;
var sinon = require('sinon');
var ColumnShifter = require('component/grid/projection/column-shifter');
var Base = require('component/grid/projection/base');
var Response = require('component/grid/model/response');

describe('projection ColumnShifter', function () {
  it('update should run normal', function () {
    var model = new ColumnShifter();

    var originalData = new Base();
    originalData.data = new Response({
      columns: {
        name: { name: 'hello', property: 'name' },
        id: { id: '007', property: 'id' },
      },
      select: ['name', 'id'],
    });
    originalData.pipe(model);
    expect(model.data.get('select')[0]).to.be.equal('column.skip.less');
    expect(model.data.get('select')[3]).to.be.equal('column.skip.more');
  });

  it('thClick should run normal', function () {
    var model = new ColumnShifter();
    model.get = sinon.stub().returns(1);
    sinon.spy(model, 'set');

    model.thClick({}, {
      column: { $metadata: { enabled: true } },
      property: 'column.skip.less',
    });
    expect(model.set.calledWith({ 'column.skip': 0 })).to.be.true;
  });
});
