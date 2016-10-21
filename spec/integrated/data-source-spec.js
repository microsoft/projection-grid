import $ from 'jquery';
import _ from 'underscore';
import pGrid from 'component/grid';
import chai from 'chai';
import util from 'util';
import driver from './driver';
import jsDataSource from './data/js-data-source';

let expect = chai.expect;
let selectedKeys = ['UserName', 'FirstName', 'LastName', 'Gender', 'Concurrency'];
let gridConfig = {
  el: '#container',
  dataSource: {
    type: 'js-data',
    entity: jsDataSource,
  },
};

let pgrid;
let gridView;

describe('data source config', function () {
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

  it('js-data should works as expected', function (done) {
    driver.once(gridView, 'didUpdate')
      .then(() => {
        console.log('test');
      })
      .then(done)
      .catch(console.log);
  });
});
