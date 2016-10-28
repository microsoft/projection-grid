var chai = require('chai');
var sinon = require('sinon');
var Promise = require('bluebird');
var JSDataProjection = require('component/grid/projection/jsdata');
var Base = require('component/grid/projection/base');

chai.use(require('sinon-chai'));
var expect = chai.expect;

describe('JSData Projection', function () {
  var MockEntity = function () {
    this.findAll = sinon.spy(function () {
      return Promise.resolve([]);
    });
  };

  var entity = null;
  var projection = null;

  beforeEach(function () {
    entity = new MockEntity();
    projection = new JSDataProjection({
      'jsdata.entity': entity,
      'jsdata.options': {},
      'jsdata.skip': 10,
      'jsdata.take': 10,
      'jsdata.filter': {},
      'jsdata.orderby': [],
      'jsdata.select': [],
    });
  });

  it('should be a projection', function () {
    expect(projection).to.be.instanceof(Base);
  });

  describe('update', function () {
    it('should call findAll of the entity and finish', function (done) {
      var onUpdateBegin = sinon.spy();
      projection.on('update:beginning', onUpdateBegin);
      projection.on('update:finished', function () {
        expect(onUpdateBegin).to.have.been.called;
        done();
      });
      projection.update();
      expect(entity.findAll).to.have.been.called;
    });
  });
});
