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
      columns: [
        { name: 'hello', property: 'name' },
        { id: '007', property: 'id' },
      ],
    });
    originalData.pipe(model);
    expect(model.data.get('columns')[0].property).to.be.equal('column.skip.less');
    expect(model.data.get('columns')[3].property).to.be.equal('column.skip.more');
  });

  it('thClick should run normal', function () {
    var model = new ColumnShifter();
    model.get = sinon.stub().returns(1);
    sinon.spy(model, 'set');

    console.log(model.get('column.skip'));
    model.thClick({}, {
      column: { $metadata: { enabled: true } },
      property: 'column.skip.less',
    });
    expect(model.set.calledWith({ 'column.skip': 0 })).to.be.true;
  });
});
