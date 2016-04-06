var expect = require('chai').expect;
var sinon = require('sinon');
var JSDataProjection = require('component/grid/projection/jsdata');
var Base = require('component/grid/projection/base');

describe('JSData Projection', function () {

  var MockEntity = function () {
    this.findAll = sinon.spy(function() {
      return [];
    });
  };

  var projection = null;

  beforeEach(function () {
    projection = new JSDataProjection({
      entity: new MockEntity(),
      options: {},
      skip: 10,
      take: 10,
      filter: {},
      orderby: [],
      select: [],
    });
  });

  it('should be a projection', function () {
    expect(projection).to.be.instanceof(Base);
  });

});
