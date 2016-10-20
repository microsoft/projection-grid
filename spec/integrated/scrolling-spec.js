import $ from 'jquery';
import _ from 'underscore';
import pGrid from 'component/grid';
import chai from 'chai';
import util from 'util';
import rawData from 'data/people.json';
import driver from './driver';

let expect = chai.expect;
let selectedKeys = ['UserName', 'FirstName', 'LastName', 'Gender', 'Concurrency'];
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
  scrolling: {
    virtualized: true,
    viewport: window,
    header: 'sticky',
  },
};

let pgrid;
let gridView;

describe('scrolling config', function () {
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

  it('sticky header should works as expected', function (done) {
    driver.once(gridView, 'didUpdate')
      .then(() => {
        // console.log('test');
      })
      .then(done)
      .catch(console.log);
  });

  // it('sub colums should works as expected', function (done) {

  // });
});
