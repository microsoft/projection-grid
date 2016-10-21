import $ from 'jquery';
import _ from 'underscore';
import pGrid from 'component/grid';
import chai from 'chai';
import util from 'util';
import rawData from './data/people.json';
import Promise from 'bluebird'
import driver from './driver';
import addressTmpl from './template/addressTmpl.jade';

let expect = chai.expect;
let selectedKeys = ['UserName', 'FirstName', 'LastName', 'AddressInfo', 'Gender', 'Concurrency'];
let memoryData = _.map(rawData.value, (row) => {
  return _.pick(row, selectedKeys);
});

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
    editable: true,
    colClasses: ['nameClass1', 'nameClass2'],
    headClasses: ['nameHeadClass1', 'nameHeadClass2'],
    bodyClasses: ['nameBodyClass1', 'nameBodyClass2'],
  }, {
    name: 'LastName',
    title: 'Last Name',
    editable: true,
    colClasses: ['nameClass3', 'nameClass4'],
    headClasses: ['nameHeadClass3', 'nameHeadClass4'],
    bodyClasses: ['nameBodyClass3', 'nameBodyClass4'],
  }, {
    name: 'Address',
    property: 'AddressInfo/0/Address',
    template: addressTmpl,
  }, {
    name: 'Gender',
    html: '<i>Gender</i>',
  }, {
    name: 'Concurrency',
  }]
};

let pgrid;
let gridView;
let expectedHeader = ['User Name', 'First Name', 'Last Name', 'Address', 'Gender', 'Concurrency'];
let expectedData = util.getExpectedGridData(memoryData, selectedKeys);
_.each(expectedData, (dataItem) => {
  let addressInfo = dataItem.AddressInfo[0] ? dataItem.AddressInfo[0].Address : '';
  dataItem.AddressInfo = addressInfo;
});

describe('columns config', function () {
  this.timeout(100000000);
  beforeEach(function () {
    util.renderTestContainer();
    pgrid = pGrid 
      .factory({ vnext: true })
      .create(gridConfig)
    gridView = pgrid.gridView.render();
  });
  
  afterEach(() => {
    gridView.remove();
    util.cleanup();
  });

  it('name, title, html, and headClasses should works as expected in header', function (done) {
    driver.once(gridView, 'didUpdate')
      .then(() => {
        return driver.element('#container > .table-container .header th');
      })
      .then((result) => {
        // validate name, tilte
        let header = _.map(result, (item) => {
          return $(item).text();
        });
        expect(header).to.eql(expectedHeader);
        // validate html
        let i = result.children('i');
        expect(i.text()).to.equal('Gender');
        // validate header classes
        let firstNameEl = result.eq(1);
        let lastNameEl = result.eq(2);
        let classAssertion = util.validateClassesForElements([firstNameEl], ['nameHeadClass1', 'nameHeadClass2']) && util.validateClassesForElements([lastNameEl], ['nameHeadClass3', 'nameHeadClass4']);
        expect(classAssertion).to.be.true;
      })
      .then(done)
      .catch(console.log);
  });
  
  it('property, template, and bodyClasses should works as expected in body', function (done) {
    driver.once(gridView, 'didUpdate')
      .then(() => {
        return driver.element('#container > .table-container tbody tr[data-key]');
      })
      .then((result) => {
        //validate data, especially for property
        let assertion = util.validateElementMatrix(result, expectedData);
        expect(assertion).to.be.true;
        // validate template & classes
        _.each(result, (rowItem, index) => {
          // validate template
          let tmplAssertion = $(rowItem).find('td').eq(3).find('div').hasClass('addressTmpl');
          expect(tmplAssertion).to.be.true;
          // validate classes
          let firstNameEl = $(rowItem).find('td').eq(1);
          let lastNameEl = $(rowItem).find('td').eq(2);
          let classAssertion = util.validateClassesForElements([firstNameEl], ['nameBodyClass1', 'nameBodyClass2']) && util.validateClassesForElements([lastNameEl], ['nameBodyClass3', 'nameBodyClass4']);
          expect(classAssertion).to.be.true;
        });
      })
      .then(done)
      .catch(console.log);
  });

  it('colClasses should works as expected in body', function (done) {
    driver.once(gridView, 'didUpdate')
      .then(() => {
        return driver.element('#container > .table-container .column-group');
      })
      .then((result) => {
        let firstNameCol = result.find('col').eq(1);
        let lastNameCol = result.find('col').eq(2);
        let classAssertion = util.validateClassesForElements([firstNameCol], ['nameClass1', 'nameClass2']) 
          && util.validateClassesForElements([lastNameCol], ['nameClass3', 'nameClass4']);
        expect(classAssertion).to.be.true;
      })
      .then(done)
      .catch(console.log);
  });

  it('sortable should works as expected', function (done) {
    driver.once(gridView, 'didUpdate')
      .then(() => {
        return driver.click('th');
      })
      .then(() => {
        return driver.once(gridView, 'didUpdate');
      })
      .then(() => {
        return driver.element('#container > .table-container tbody tr[data-key]');
      })
      .then((result) => {
        let sortedData = _.sortBy(expectedData, 'UserName');
        let assertion = util.validateElementMatrix(result, sortedData);
        expect(assertion).to.be.true;
      })
      .then(() => {
        return driver.click('th');
      })
      .then(() => {
        return driver.once(gridView, 'didUpdate');
      })
      .then(() => {
        return driver.element('#container > .table-container tbody tr[data-key]');
      })
      .then((result) => {
        let sortedData = _.sortBy(expectedData, 'UserName').reverse();
        let assertion = util.validateElementMatrix(result, sortedData);
        expect(assertion).to.be.true;
      })
      .then(done)
      .catch(console.log);
  });

  it('editable should works as expected', function (done) {
    driver.once(gridView, 'didUpdate')
      .then(() => {
        return driver.element('#container > .table-container tbody tr[data-key]');
      })
      .then((result) => {
        driver.click(result.eq(0).find('td').eq(2));
      })
      .then(() => {
        return Promise.all([
          driver.element('form.form-inline > .form-control'),
          driver.element('form.form-inline > .save'),
          driver.element('form.form-inline > .cancel'),
        ]);
      })
      .then((result) => {
        expect(result[0].val()).to.be.equal('Whyte');
        expect(result[1].text()).to.be.equal('Save');
        expect(result[2].text()).to.be.equal('Cancel');
      })
      .then(() => {
        return driver.setValue('form.form-inline > .form-control', 'Conan');
      })
      .then(() => {
        return driver.click('form.form-inline > .save');
      })
      .then(() => {
        return driver.once(gridView, 'didUpdate');
      })
      .then(() => {
        return driver.element('#container > .table-container tbody tr[data-key]');
      })
      .then((result) => {
        let editedName = result.eq(0).find('td').eq(2).text();
        expect(editedName).to.be.equal('Conan');
      })
      .then(done)
      .catch(console.log);
  });

  // it('sub colums should works as expected', function (done) {

  // });
});
