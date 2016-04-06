var expect = require('chai').expect;
var sinon = require('sinon');
var Page = require('component/grid/projection/page');
var Base = require('component/grid/projection/base');
var Response = require( 'component/grid/model/response');

describe('projection Page', function () {

  it('update should run normal', function() {
    var model = new Page({
      'page.size': 200,
      'page.number': 0
    });

    var originalData = new Base();
    originalData.data = new Response({count: 400});
    originalData.pipe(model);
    expect(model.data.get('page.count')).to.be.equal(2);
  });

});
