var chai = require('chai');
var expect = chai.expect;

/* globals browser */
describe('projection grid', function () {
  it('should have the given title', function () {
    var title = browser.getTitle();
    expect(title).to.equal('demos_simple');
  });
});
