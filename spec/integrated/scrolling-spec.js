import $ from 'jquery';
import _ from 'underscore';
import pGrid from 'component/grid';
import chai from 'chai';
import util from 'util';
import rawData from './data/scrolling.json';
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

describe('scrolling config', function () {
  beforeEach(function () {
    util.renderTestContainer();
    pgridFactory = pGrid 
      .factory({ vnext: true })
  });
  
  afterEach(() => {
    gridView.remove();
    util.cleanup();
  });

  it('static header should works as expected', function (done) {
    let scorllingConfig = {
      scrolling: {
        virtualized: true,
        viewport: window,
        header: 'static',
      }
    };

    gridView = pgridFactory
      .create(_.extend(scorllingConfig, gridConfig))
      .gridView
      .render();
    driver.once(gridView, 'didUpdate')
      .then(() => {
        return Promise.all([
          driver.element('table.sticky-header'),
          driver.element('div.fixed-header'),
        ]);
      })
      .then((result) => {
        expect(result[0].length).to.be.equal(0);
        expect(result[1].length).to.be.equal(0);
      })
      .then(() => {
        return driver.element('#container .table-container table');
      })
      .then((result) => {
        expect(result.length).to.be.equal(1);
      })
      .then(done)
      .catch(console.log);
  });

  it('fixed header should works as expected', function (done) {
    let scorllingConfig = {
      scrolling: {
        viewport: window,
        header: 'fixed',
      }
    };

    gridView = pgridFactory
      .create(_.extend(scorllingConfig, gridConfig))
      .gridView
      .render();
    driver.once(gridView, 'didUpdate')
      .then(() => {
        return driver.element('div.fixed-header');
      })
      .then((result) => {
        expect(result.length).to.be.equal(1);
      })
      .then(done)
      .catch(console.log);
  });

  it('sticky header should works as expected', function (done) {
    let scorllingConfig = {
      scrolling: {
        virtualized: true,
        viewport: window,
        header: 'sticky',
      }
    };

    gridView = pgridFactory
      .create(_.extend(scorllingConfig, gridConfig))
      .gridView
      .render();
    driver.once(gridView, 'didUpdate')
      .then(() => {
        return driver.scroll(0, document.body.scrollHeight);
      })
      .then(() => {
        return driver.pause(50);
      })
      .then(() => {
        return driver.element('table.sticky-header');
      })
      .then((result) => {
        expect(result.length).to.be.equal(1);
        expect(result.position().top).to.be.equal(0);
      })
      .then(done)
      .catch(console.log);
  });

  it('sticky header with numerical offset should works as expected', function (done) {
    let scorllingConfig = {
      scrolling: {
        virtualized: true,
        viewport: window,
        header: {
          type: 'sticky',
          offset: 10,
        },
      }
    };

    gridView = pgridFactory
      .create(_.extend(scorllingConfig, gridConfig))
      .gridView
      .render();
    driver.once(gridView, 'didUpdate')
      .then(() => {
        return driver.scroll(0, document.body.scrollHeight);
      })
      .then(() => {
        return driver.pause(50);
      })
      .then(() => {
        return driver.element('table.sticky-header');
      })
      .then((result) => {
        expect(result.length).to.be.equal(1);
        expect(result.position().top).to.be.equal(10);
      })
      .then(done)
      .catch(console.log);
  });

  it('sticky header with function offset should works as expected', function (done) {
    let scorllingConfig = {
      scrolling: {
        virtualized: true,
        viewport: window,
        header: () => {
          return 15;
        },
      },
    };

    gridView = pgridFactory
      .create(_.extend(scorllingConfig, gridConfig))
      .gridView
      .render();
    driver.once(gridView, 'didUpdate')
      .then(() => {
        return driver.scroll(0, document.body.scrollHeight);
      })
      .then(() => {
        return driver.pause(50);
      })
      .then(() => {
        return driver.element('table.sticky-header');
      })
      .then((result) => {
        expect(result.length).to.be.equal(1);
        expect(result.position().top).to.be.equal(15);
      })
      .then(done)
      .catch(console.log);
  });

  it('static header should be default when config a non-supported header type', function (done) {
    let scorllingConfig = {
      scrolling: {
        virtualized: true,
        viewport: window,
        header: 'non-supported type',
      }
    };

    gridView = pgridFactory
      .create(_.extend(scorllingConfig, gridConfig))
      .gridView
      .render();
    driver.once(gridView, 'didUpdate')
      .then(() => {
        return Promise.all([
          driver.element('table.sticky-header'),
          driver.element('div.fixed-header'),
        ]);
      })
      .then((result) => {
        expect(result[0].length).to.be.equal(0);
        expect(result[1].length).to.be.equal(0);
      })
      .then(() => {
        return driver.element('#container .table-container table');
      })
      .then((result) => {
        expect(result.length).to.be.equal(1);
      })
      .then(done)
      .catch(console.log);
  });
});
