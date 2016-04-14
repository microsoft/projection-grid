var expect = require('chai').expect;
var PropertyTemplate = require('component/grid/projection/property-template');
var Base = require('component/grid/projection/base');
var Response = require('component/grid/model/response');

describe('projection PropertyTemplate', function () {
  it('update should run normal', function () {
    var model = new PropertyTemplate({
      'property.template': {
        name: function (local) {
          return local.model[local.property];
        },
        id: function (local) {
          return local.model[local.property];
        },
      },
    });

    var originalData = new Base();
    originalData.data = new Response({
      value: [
        { name: 'hello', id: 'hello_id' },
        { name: 'world', id: 'world_id' },
      ],
    });
    originalData.pipe(model);
    expect(model.data.get('value')[0].name.$html).to.be.equal('hello');
    expect(model.data.get('value')[0].id.$html).to.be.equal('hello_id');

    expect(model.data.get('value')[1].name.$html).to.be.equal('world');
    expect(model.data.get('value')[1].id.$html).to.be.equal('world_id');
  });
});
