import $ from 'jquery';
import _ from 'underscore';
import pGrid from 'component/grid';
import chai from 'chai';
import util from 'util';
import rawData from 'data/people.json';
import oldData from 'data/scrolling.json';
import driver from 'driver';

let expect = chai.expect;
let memoryData = _.map(rawData.value, (row) => {
  return _.pick(row, 'UserName', 'FirstName', 'LastName', 'Gender', 'Concurrency');
});
let expectedHeader = _.keys(_.first(memoryData));
let expectedData = util.getExpectedGridData(memoryData);

let pgrid;
let gridView;

let columns = [
  {
    name: 'UserName',
  },
  {
    name: 'FirstName',
  },
];

let schema = {
  
};

let baseConfig = {
  el: '#container',
  dataSource: {
    type: 'memory',
    data: memoryData,
  },
  columns,
};

describe('base configuration for non-vnext grid', function () {
  this.timeout(100000000);
  beforeEach(function () {
    util.renderTestContainer();
    pgrid = pGrid
      .factory()
      .create(baseConfig)
    gridView = pgrid.gridView.render({fetch: true});
  });
  
  afterEach(() => {
    gridView.remove();
    util.cleanup();
  });

  it('data should be updated after set a new configuration to grid', function (done) {
    driver.pause(100)
      .then(() => {
        console.log('test');
      })
      .then(done)
      .catch(console.log);
  });
});
