import $ from 'jquery';
import _ from 'underscore';
import pGrid from 'component/grid';
import chai from 'chai';
import util from 'util';
import rawData from 'data/people.json';
import Promise from 'bluebird'
import driver from './driver';

let expect = chai.expect;
Promise.promisifyAll(driver);

let memoryData = _.map(rawData.value, (row) => {
  return _.pick(row, 'UserName', 'FirstName', 'LastName', 'Gender', 'Concurrency');
});

let gridConfig = {
  el: '#container',
  dataSource: {
    type: 'memory',
    data: memoryData,
    primaryKey: 'UserName',
  },
};

let expectedHeader = _.keys(_.first(memoryData));
let expectedData = util.getExpectedGridData(memoryData);
let pgrid;
let gridView;

describe('minimize config', function () {
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

  it('should render header correctly', function (done) {
    gridView.on('didUpdate', () => {
      driver.elementAsync('#container > .table-container .header th')
        .then((result) => {
          let header = _.map(result, (item) => {
            return item.textContent;
          });
          expect(header).to.eql(expectedHeader);
          console.log(header);
        })
        .nodeify(done);
    });
  });
  
  it('should render data correctly', function (done) {
    gridView.on('didUpdate', () => {
      driver.elementAsync('#container > .table-container tbody tr[data-key]')
        .then((result) => {
          let assertion = util.validateElementMatrix(result, expectedData);
          expect(assertion).to.be.true;
        })
        .nodeify(done);
    });
  });
});