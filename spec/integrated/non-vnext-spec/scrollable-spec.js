import $ from 'jquery';
import _ from 'underscore';
import pGrid from 'component/grid';
import chai from 'chai';
import util from 'util';
import driver from 'driver';
import scrollingData from 'data/scrolling.json';

let expect = chai.expect;
let memoryDataSource = _.map(scrollingData.value, (row) => {
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

describe('scrollable for non-vnext', function () {
  this.timeout(100000);
  beforeEach(function () {
    util.renderTestContainer();
    pgridFactory = pGrid 
      .factory();
  });
  
  afterEach(() => {
    gridView.remove();
    util.cleanup();
  });

  it('fixed header should works as expected for non-vnext', function (done) {
    let scrollalbeConfig = {
      scrollable: {
        fixedHeader: true,
      },
    };

    gridView = pgridFactory
      .create(_.extend(scrollalbeConfig, gridConfig))
      .gridView
      .render({fetch: true});

    driver.scroll(0, document.body.scrollHeight)
      .then(() => {
        return driver.pause(50);
      })
      .then(() => {
        return driver.element('table.grid thead');
      })
      .then((result) => {
        expect(result.position().top).to.be.equal(0);
      })
      .then(done)
      .catch(console.log);
  });

  it('virtualization should works as expected for non-vnext', function (done) {
    let scrollalbeConfig = {
      scrollable: {
        virtual: true,
        fixedHeader: true,
      },
    };

    gridView = pgridFactory
      .create(_.extend(scrollalbeConfig, gridConfig))
      .gridView
      .render({fetch: true});

    driver.scroll(0, document.body.scrollHeight)
      .then(() => {
        return driver.pause(50);
      })
      .then(() => {
        return driver.element('#container .grid tbody .table__row--body');
      })
      .then((result) => {
        let lastRow = result.last();
        // chrome has 2pixel border for viewport.
        let bottomForLastRow = lastRow.position().top + lastRow.outerHeight(true) + 2;
        let documentHeight = $(document).height();

        expect(bottomForLastRow).to.equal(documentHeight);
        let assertion = util.validateElementMatrix(result.last(), [['laurelosborn', 'Laurel', 'Osborn', 'Female']]);
        expect(assertion).to.be.true;
      })
      .then(done)
      .catch(console.log);
  });
});
