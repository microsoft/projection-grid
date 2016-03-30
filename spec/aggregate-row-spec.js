var expect = require('chai').expect;
var sinon = require('sinon');
var AggregateRow = require('component/grid/projection/aggregate-row');
var Base = require('component/grid/projection/base');
var Response = require( 'component/grid/model/response');

describe('projection AggregateRow', function () {

  it('update should run normal', function() {
    var model = new AggregateRow({
      'aggregate.top': function(data) {
        return [{
          name: data.get('value').length,
          $metadata: {}
        }];
      },

      'aggregate.bottom': function(data) {
        return [{
          name: data.get('value').length,
          $metadata: {} 
        }];
      }
    });

    var originalData = new Base();
    originalData.data = new Response({
      value: [
        {name: new String('hello'), id: 'hello_id'},
        {name: new String('world'), id: 'world_id'}
      ]
    });

    originalData.pipe(model);
    expect(model.data.get('value')[0]['$metadata']).to.be.eql({type: 'aggregate'});
    expect(model.data.get('value')[0]['name']).to.be.eql(2);

    expect(model.data.get('value')[3]['$metadata']).to.be.eql({type: 'aggregate'});
    expect(model.data.get('value')[3]['name']).to.be.eql(2);

  });

});
