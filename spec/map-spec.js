var expect = require('chai').expect;
var sinon = require('sinon');
var MapProjection = require('component/grid/projection/map');
var Base = require('component/grid/projection/base');
var Response = require( 'component/grid/model/response');

describe('projection map', function () {

  it('update should run normal', function() {
    var model = new MapProjection({
      map: function(item) {
        return [{name: item.name}];
      }
    });
    var originalData = new Base();
    originalData.data = new Response({
      value: [{name: 'hello'}]
    });
    sinon.spy(model, 'patch');
    originalData.pipe(model);
    expect(model.patch.called).to.be.true;
  });

});
