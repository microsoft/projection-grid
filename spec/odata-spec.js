var expect = require('chai').expect;
var sinon = require('sinon');
var $ = require('lib/jquery');
var OData = require('component/grid/projection/odata');

describe('projection OData', function () {

  it('constructor and initialize should run normal', function() {
    var model = new OData({
      url: 'www.bing.com',
      skip: 10,
      take: 10,
      filter: 'name'
    });
    sinon.stub($, 'getJSON', function() {
      var obj = {
        success: function(cb) { return obj; },
        error: function(cb) { return obj; },
        complete: function(cb) {}
      };
      return obj;
    });
    model.update();
    var expectRes = {
      $format: 'json', 
      $count: true,
      $top: 10,
      $skip: 10
    };
    expect($.getJSON.calledWith('www.bing.com', expectRes)).to.be.true;
  });

});
