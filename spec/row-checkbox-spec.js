var expect = require('chai').expect;
var sinon = require('sinon');
var RowCheckbox = require('component/grid/projection/row-checkbox');
var Base = require('component/grid/projection/base');
var Response = require( 'component/grid/model/response');

describe('projection RowCheckbox', function () {

  it('update should run normal', function() {
    var model = new RowCheckbox({
      'row.check.id': 'id',
      'column.checked': 'name',
    });

    var originalData = new Base();
    originalData.data = new Response({
      value: [
        {name: new String('hello'), id: 'hello_id'},
        {name: new String('world'), id: 'world_id'}
      ],
      columns: [
        {name: 'hello', property: 'name'},
        {id: 'hello_id', property: 'id'}
      ]
    });

    originalData.pipe(model);
    expect(model.data.get('value')[0]['name']['$html']).to.be.not.null;
    expect(model.data.get('value')[1]['name']['$html']).to.be.not.null;
  });

});
