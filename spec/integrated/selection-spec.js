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
};

let pgrid;
let pgridFactory;
let gridView;

describe('selection config', function () {
  this.timeout(100000000);
  beforeEach(function () {
    util.renderTestContainer();
    pgridFactory = pGrid 
      .factory({ vnext: true });
  });
  
  afterEach(() => {
    gridView.remove();
    util.cleanup();
  });

  it('selection should works as expected', function (done) {
    let baseSelectionConfig = {
      selection: {
        enabled: true,
      },
    };
    gridView = pgridFactory
      .create(_.extend(baseSelectionConfig, gridConfig))
      .gridView
      .render();
    driver.once(gridView, 'didUpdate')
      .then(() => {
        return driver.element('#container > .table-container tbody tr[data-key]');
      })
      .then((result) => {
        let firstCheckbox = result.eq(0).find('td').eq(0).find('input');
        return driver.click(firstCheckbox);
      })
      .then(() => {
        return driver.element('#container > .table-container tbody tr[data-key]');
      })
      .then((result) => {
        let firstCheckbox = result.eq(0).find('td').eq(0).find('input');
        let assertion = firstCheckbox.is(':checked');
        expect(assertion).to.be.true;
      })
      .then(() => {
        return driver.element('#container > .table-container tbody tr[data-key]');
      })
      .then((result) => {
        let firstCheckbox = result.eq(0).find('td').eq(0).find('input');
        return driver.click(firstCheckbox);
      })
      .then(done)
      .catch(console.log);
  });

  // it('sub colums should works as expected', function (done) {

  // });
});
