import $ from 'jquery';
import _ from 'underscore';
import pGrid from 'component/grid';
import chai from 'chai';
import util from 'util';
import rawData from 'data/people.json';
import driver from 'driver';
import colAddressTemplate from 'template/column-address.jade';

/* eslint-disable no-unused-expressions */

let expect = chai.expect;
let selectedKeys = ['UserName', 'FirstName', 'LastName', 'AddressInfo', 'Gender', 'Concurrency'];
let memoryData = _.map(rawData.value, row => {
  return _.pick(row, selectedKeys);
});

let bodyClassObject = {
  nameBodyClass3: true,
  nameBodyClass4: true,
};

let gridConfig = {
  el: '#container',
  dataSource: {
    type: 'memory',
    data: memoryData,
    primaryKey: 'UserName',
  },
  columns: [{
    name: 'UserName',
    title: 'User Name',
    sortable: true,
  }, {
    name: 'FirstName',
    title: 'First Name',
    sortable: [1, -1, 0],
    colClasses: ['nameClass1', 'nameClass2'],
    headClasses: ['nameHeadClass1', 'nameHeadClass2'],
    bodyClasses: bodyClassGenerator,
    colAttributes: {
      'data-name': _.property('name'),
      'data-sortable': true,
    },
    headAttributes: {
      'data-title': _.property('title'),
      'data-sortable': true,
    },
    bodyAttributes: {
      'data-name': 'FirstName',
      'data-length': ({ item }) => item.FirstName.length,
      'data-type': 'string',
    },
  }, {
    name: 'LastName',
    title: 'Last Name',
    colClasses: ['nameClass3', 'nameClass4'],
    headClasses: ['nameHeadClass3', 'nameHeadClass4'],
    bodyClasses: bodyClassObject,
  }, {
    name: 'Address',
    property: 'AddressInfo/0/Address',
    template: colAddressTemplate,
  }, {
    name: 'Gender',
    html: '<i>Gender</i>',
  }, {
    name: 'Concurrency',
  }],
};

let pgrid = null;
let gridView = null;
let expectedHeader = ['User Name', 'First Name', 'Last Name', 'Address', 'Gender', 'Concurrency'];
let expectedData = util.getExpectedGridData(memoryData, selectedKeys);
_.each(expectedData, dataItem => {
  let addressInfo = dataItem.AddressInfo[0] ? dataItem.AddressInfo[0].Address : '';
  dataItem.AddressInfo = addressInfo;
});

function bodyClassGenerator() {
  return ['nameBodyClass1', 'nameBodyClass2'];
}

describe('columns config', function () {
  beforeEach(() => {
    util.renderTestContainer();
    pgrid = pGrid
      .factory({ vnext: true })
      .create(gridConfig);
    gridView = pgrid.gridView;
    return new Promise(resolve => gridView.render(resolve))
      .then(() => driver.once(gridView, 'didUpdate'));
  });

  afterEach(() => {
    gridView.remove();
    util.cleanup();
  });

  it('name, title, html, and headClasses should works as expected in header', function () {
    return driver
      .element('#container > .table-container .header th')
      .then(result => {
        // validate name, tilte
        let header = _.map(result, item => {
          return $(item).text();
        });
        expect(header).to.eql(expectedHeader);
        // validate html
        let i = result.children('i');
        expect(i.text()).to.equal('Gender');
        // validate header classes
        let firstNameEl = result.eq(1);
        let lastNameEl = result.eq(2);
        let classAssertion = util.validateClassesForElement(firstNameEl, ['nameHeadClass1', 'nameHeadClass2']) && util.validateClassesForElement(lastNameEl, ['nameHeadClass3', 'nameHeadClass4']);
        expect(classAssertion).to.be.true;
        return null;
      })
      .tapCatch(console.log);
  });

  it('property, template, and bodyClasses should works as expected in body', function () {
    return driver
      .element('#container > .table-container tbody tr[data-key]')
      .then(result => {
        // validate data, especially for property
        let assertion = util.validateElementMatrix(result, expectedData);
        expect(assertion).to.be.true;
        // validate template & classes
        _.each(result, rowItem => {
          // validate template
          let tmplAssertion = $(rowItem).find('td').eq(3).find('div').hasClass('column-address');
          expect(tmplAssertion).to.be.true;
          // validate classes
          let firstNameEl = $(rowItem).find('td').eq(1);
          let lastNameEl = $(rowItem).find('td').eq(2);
          let classAssertion = util.validateClassesForElement(firstNameEl, ['nameBodyClass1', 'nameBodyClass2']) && util.validateClassesForElement(lastNameEl, ['nameBodyClass3', 'nameBodyClass4']);
          expect(classAssertion).to.be.true;
          return null;
        });
      })
      .tapCatch(console.log);
  });

  it('colClasses should works as expected in body', function () {
    return driver
      .element('#container > .table-container .column-group')
      .then(result => {
        let firstNameCol = result.find('col').eq(1);
        let lastNameCol = result.find('col').eq(2);
        let classAssertion = util.validateClassesForElement(firstNameCol, ['nameClass1', 'nameClass2']) &&
          util.validateClassesForElement(lastNameCol, ['nameClass3', 'nameClass4']);
        expect(classAssertion).to.be.true;
        return null;
      })
      .tapCatch(console.log);
  });

  describe('sortable', function () {
    it('should do 2 state sorting correctly', function () {
      const sortAsc = _.sortBy(expectedData, 'UserName');
      const sortDesc = _.sortBy(expectedData, 'UserName').reverse();

      return driver
        .click('th[data-name="UserName"]')
        .then(() => driver.once(gridView, 'didUpdate'))
        .then(() => driver.element('#container > .table-container tbody tr[data-key]'))
        .then(result => {
          expect(util.validateElementMatrix(result, sortAsc)).to.be.true;
          return null;
        })
        .then(() => driver.click('th[data-name="UserName"]'))
        .then(() => driver.once(gridView, 'didUpdate'))
        .then(() => driver.element('#container > .table-container tbody tr[data-key]'))
        .then(result => {
          expect(util.validateElementMatrix(result, sortDesc)).to.be.true;
          return null;
        })
        .then(() => driver.click('th[data-name="UserName"]'))
        .then(() => driver.once(gridView, 'didUpdate'))
        .then(() => driver.element('#container > .table-container tbody tr[data-key]'))
        .then(result => {
          expect(util.validateElementMatrix(result, sortAsc)).to.be.true;
          return null;
        });
    });

    it('should do multiple state sorting correctly', function () {
      const sortAsc = _.sortBy(expectedData, 'FirstName');
      const sortDesc = _.sortBy(expectedData, 'FirstName').reverse();

      return driver
        .click('th[data-name="FirstName"]')
        .then(() => driver.once(gridView, 'didUpdate'))
        .then(() => driver.element('#container > .table-container tbody tr[data-key]'))
        .then(result => {
          expect(util.validateElementMatrix(result, sortAsc)).to.be.true;
          return null;
        })
        .then(() => driver.click('th[data-name="FirstName"]'))
        .then(() => driver.once(gridView, 'didUpdate'))
        .then(() => driver.element('#container > .table-container tbody tr[data-key]'))
        .then(result => {
          expect(util.validateElementMatrix(result, sortDesc)).to.be.true;
          return null;
        })
        .then(() => driver.click('th[data-name="FirstName"]'))
        .then(() => driver.once(gridView, 'didUpdate'))
        .then(() => driver.element('#container > .table-container tbody tr[data-key]'))
        .then(result => {
          expect(util.validateElementMatrix(result, expectedData)).to.be.true;
          return null;
        })
        .then(() => driver.click('th[data-name="FirstName"]'))
        .then(() => driver.once(gridView, 'didUpdate'))
        .then(() => driver.element('#container > .table-container tbody tr[data-key]'))
        .then(result => {
          expect(util.validateElementMatrix(result, sortAsc)).to.be.true;
          return null;
        });
    });
  });

  it('should render the attributes correctly', function () {
    return driver
      .element('#container > .table-container colgroup > col[data-name="FirstName"]')
      .then(result => {
        expect(result.length).to.equal(1);
        expect(result.attr('data-sortable')).to.be.equal('');
      })
      .then(() => driver.element('#container > .table-container th[data-name="FirstName"]'))
      .then(result => {
        expect(result.length).to.equal(1);
        expect(result.attr('data-title')).to.equal('First Name');
        expect(result.attr('data-sortable')).to.be.equal('');
      })
      .then(() => driver.element('#container > .table-container tbody > tr[data-key]:eq(0) > td[data-name="FirstName"]'))
      .then(result => {
        expect(result.length).to.equal(1);
        expect(result.attr('data-type')).to.equal('string');
        expect(result.attr('data-length')).to.equal(result.text().length.toString());
      });
  });

  // it(sub colums should works as expected', function () {
  // });
});
