var expect = require('chai').expect;

/* global browser */
describe('webdriver.io page', function () {
  it('should have the right title - the fancy generator way', function () {
    browser.url('http://webdriver.io');
    var title = browser.getTitle();
    expect(title).to.be.equal('WebdriverIO - Selenium 2.0 javascript bindings for nodejs');
  });
});
