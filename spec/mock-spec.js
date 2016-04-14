var expect = require('chai').expect;
var Mock = require('component/grid/projection/mock');
var Base = require('component/grid/projection/base');
var Response = require('component/grid/model/response');

describe('projection Mock', function () {
  it('update should run normal', function () {
    var model = new Mock({ n: 10 });

    var originalData = new Base();
    originalData.data = new Response();

    originalData.pipe(model);
    expect(model.data.get('value').length).to.be.equal(10);
    expect(model.data.get('count')).to.be.equal(10);
  });
});
