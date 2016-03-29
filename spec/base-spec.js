var expect = require('chai').expect;
var sinon = require('sinon');
var _ = require('lib/underscore');
var Base = require('component/grid/projection/base');

describe('projection Base', function () {
  var ExtendModel, instance;
  beforeEach(function() {
    ExtendModel = Base.extend({
      defaults: {
        attr1: 'attr1'
      }
    });
    instance = new ExtendModel;
  });

  it('constructor and initialize should run normal', function() {
    expect(instance.localKeys).to.be.deep.equal(["attr1"]);
    expect(instance.data).to.not.be.null;
  });

  it('pipe should run normal', function() {
    var otherInstance = new ExtendModel;
    sinon.spy(instance.data, 'off');
    sinon.spy(instance, 'off');
    sinon.spy(instance.data, 'on');
    sinon.spy(instance, 'on');
    sinon.spy(otherInstance, 'update');
    instance.pipe(otherInstance);

    expect(instance.data.off.called).to.be.true;
    expect(instance.off.called).to.be.true;
    expect(instance.data.on.called).to.be.true;
    expect(instance.on.called).to.be.true;
    expect(otherInstance.update.called).to.be.true;
  });

  it('set should run normal', function() {
    var otherInstance = new ExtendModel;
    sinon.spy(otherInstance, 'beforeSet');
    sinon.spy(otherInstance, 'afterSet');

    instance.pipe(otherInstance);
    otherInstance.set({'attr1': 'value1', 'attr2': 'value2'});

    expect(otherInstance.beforeSet.calledWith({attr1: 'value1'}, {'attr2': 'value2'})).to.true;
    expect(otherInstance.afterSet.called).to.be.true;
    expect(otherInstance.get('attr1')).to.equal('value1');
  });
});
