var expect = require('chai').expect;

/* global browser */
/* eslint no-unused-expressions: 0 */
describe('webdriver.io page', function () {
  beforeEach(function (cb) {
    browser.waitForExist('.table.grid', cb);
  });

  it('should expand and collapse the group column', function () {
    var collpaseSpan = browser.element('.pop-collapse');
    expect(collpaseSpan).to.be.exist;
    collpaseSpan.click();
    var expandBtn = browser.element('.pop-expand');
    expect(expandBtn).to.be.exist;
    expandBtn.click();
    expect(browser.isExisting('.pop-collapse')).to.be.true;
  });
});
