import $ from 'jquery';
import _ from 'underscore';
import pGrid from 'component/grid';
import chai from 'chai';
import util from 'util';
import driver from 'driver';
import peopleData from 'data/people.json';

let expect = chai.expect;
let memoryDataSource = _.map(peopleData.value, (row) => {
  return _.pick(row, 'UserName', 'FirstName', 'LastName', 'Gender', 'Concurrency');
});
let memoryHeader = _.keys(_.first(memoryDataSource));
let memoryData = util.getExpectedGridData(memoryDataSource);
let gridConfig = {
  el: '#container',
  dataSource: {
    type: 'memory',
    data: memoryData,
  },
  columns: [
    {
      name: 'UserName',
    },
    {
      name: 'FirstName',
    },
    {
      name: 'LastName',
    },
    {
      name: 'Gender',
    },
  ],
};

let pgrid;
let pgridFactory;
let gridView;

describe('projection plugins for non-vnext', function () {
  let headRowSelector = '#container .grid thead .table__row--header';
  let bodyRowSelector = '#container .grid tbody .table__row--body';

  beforeEach(function () {
    util.renderTestContainer();
    pgridFactory = pGrid 
      .factory();
  });
  
  afterEach(() => {
    gridView.remove();
    util.cleanup();
  });

  it('selectable should works as expected for non-vnext', function (done) {
    let selectionConfig = {
      selectable: true,
    };

    gridView = pgridFactory
      .create(_.extend(selectionConfig, gridConfig))
      .gridView
      .render({fetch: true});
    driver.element(bodyRowSelector)
      .then((result) => {
        return driver.click(util.getCheckboxElFromTbody(result, 0, 0));
      })
      .then(() => {
        return driver.element(bodyRowSelector);
      })
      .then((result) => {
        let checkboxEl = util.getCheckboxElFromTbody(result, 0, 0);
        let assertion = checkboxEl.is(':checked');
        expect(assertion).to.be.true;
      })
      .then(() => {
        return driver.element(bodyRowSelector);
      })
      .then((result) => {
        return driver.click(util.getCheckboxElFromTbody(result, 0, 0));
      })
      .then(() => {
        return driver.element(bodyRowSelector);
      })
      .then((result) => {
        let checkboxEl = util.getCheckboxElFromTbody(result, 0, 0);
        let assertion = checkboxEl.is(':checked');
        expect(assertion).to.be.false;
      })
      .then(done)
      .catch(console.log);
  });

  it('select all should works as expected for non-vnext', function (done) {
    let selectionConfig = {
      selectable: true,
    };

    gridView = pgridFactory
      .create(_.extend(selectionConfig, gridConfig))
      .gridView
      .render({ fetch: true }); 
    driver.element(headRowSelector)
      .then((result) => {
        return driver.click(util.getCheckboxElFromThead(result, 0, 0));
      })
      .then(() => {
        return Promise.all([
          driver.element(headRowSelector),
          driver.element(bodyRowSelector),
        ]);
      })
      .then((result) => {
        let checkboxHeaderEl = util.getCheckboxElFromThead(result[0], 0, 0);
        let checkboxBodyEl = util.getCheckboxElFromTbody(result[1], 0, 0);
        let assertion = checkboxHeaderEl.is(':checked') && checkboxBodyEl.is(':checked');
        expect(assertion).to.be.true;
      })
      .then(() => {
        return driver.element(headRowSelector);
      })
      .then((result) => {
        return driver.click(util.getCheckboxElFromThead(result, 0, 0));
      })
      .then(() => {
        return Promise.all([
          driver.element('#container > .table-container .header tr'),
          driver.element('#container > .table-container tbody tr[data-key]'),
        ]);
      })
      .then((result) => {
        let checkboxHeaderEl = util.getCheckboxElFromThead(result[0], 0, 0);
        let checkboxBodyEl = util.getCheckboxElFromTbody(result[1], 0, 0);
        let assertion = checkboxHeaderEl.is(':checked') || checkboxBodyEl.is(':checked');
        expect(assertion).to.be.false;
      })
      .then(done)
      .catch(console.log);
  });
});
