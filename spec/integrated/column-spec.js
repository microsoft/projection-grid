import $ from 'jquery';
import _ from 'underscore';
import pGrid from 'component/grid';
import chai from 'chai';
import util from 'util';
import rawData from 'data/people.json';
import Promise from 'bluebird'
import driver from './driver';
import addressTmpl from './template/addressTmpl.jade';

let expect = chai.expect;
Promise.promisifyAll(driver);

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
    headerClasses: ['nameHeaderClass1', 'nameHeaderClass2'],
    bodyClasses: ['nameBodyClass1', 'nameBodyClass2'],
  }, {
    name: 'LastName',
    title: 'Last Name',
    editable: true,
    colClasses: ['nameClass1', 'nameClass2'],
    headClasses: ['nameHeaderClass1', 'nameHeaderClass2'],
    bodyClasses: ['nameBodyClass1', 'nameBodyClass2'],
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

  it('configuration name, title, html, property, template should works as expected', function (done) {
    gridView.once('didUpdate', () => {})
  });

  it('sortable should works as expected', function (done) {
    gridView.once('didUpdate', () => {
      driver.clickAsync('th')
        .then(() => {
          gridView.once('didUpdate', () => {
            driver.elementAsync('#container > .table-container tbody tr[data-key]')
              .then((result) => {
                let sortedData = _.sortBy(expectedData, 'UserName');
                let assertion = util.validateElementMatrix(result, sortedData);
                expect(assertion).to.be.true;
                driver.clickAsync('th')
                  .then( () => {
                    gridView.once('didUpdate', () => {
                      driver.elementAsync('#container > .table-container tbody tr[data-key]')
                        .then((result) => {
                          let sortedData = _.sortBy(expectedData, 'UserName').reverse();
                          let assertion = util.validateElementMatrix(result, sortedData);
                          expect(assertion).to.be.true;
                        })
                        .nodeify(done);
                    })
                  })
              })
          })
        })
    });
  });

  it('editable should works as expected', function (done) {

  });

  it('settings for classes should works as expected', function (done) {

  });

  it('sub colums should works as expected', function (done) {

  });
});
