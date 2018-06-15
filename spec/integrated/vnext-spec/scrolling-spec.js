import _ from 'underscore';
import pGrid from 'component/grid';
import chai from 'chai';
import util from 'util';
import rawData from 'data/scrolling.json';
import driver from 'driver';
import Promise from 'bluebird';

/* eslint-disable no-unused-expressions */

let expect = chai.expect;
let selectedKeys = ['UserName', 'FirstName', 'LastName', 'Gender', 'Concurrency'];
let memoryData = _.map(rawData.value, row => _.pick(row, selectedKeys));

let gridConfig = {
  el: '#container',
  dataSource: {
    type: 'memory',
    data: memoryData,
    primaryKey: 'UserName',
  },
};

let pgridFactory = null;
let gridView = null;

describe('scrolling config', function () {
  beforeEach(function () {
    util.renderTestContainer();
    pgridFactory = pGrid
      .factory({ vnext: true });
  });

  afterEach(() => {
    gridView.remove();
    util.cleanup();
  });

  it('static header should works as expected', function () {
    let scorllingConfig = {
      scrolling: {
        virtualized: true,
        viewport: window,
        header: 'static',
      },
    };

    gridView = pgridFactory
      .create(_.extend(scorllingConfig, gridConfig))
      .gridView;

    return new Promise(resolve => gridView.render(resolve))
      .then(() => driver.once(gridView, 'didUpdate'))
      .then(() => {
        return Promise.all([
          driver.element('table.sticky-header'),
          driver.element('div.fixed-header'),
        ]);
      })
      .then(result => {
        expect(result[0].length).to.be.equal(0);
        expect(result[1].length).to.be.equal(0);
      })
      .then(() => {
        return driver.element('#container .table-container table');
      })
      .then(result => {
        expect(result.length).to.be.equal(1);
      })
      .tapCatch(console.log);
  });

  it('fixed header should works as expected', function () {
    let scorllingConfig = {
      scrolling: {
        viewport: window,
        header: 'fixed',
      },
    };

    gridView = pgridFactory
      .create(_.extend(scorllingConfig, gridConfig))
      .gridView;

    return new Promise(resolve => gridView.render(resolve))
      .then(() => driver.once(gridView, 'didUpdate'))
      .then(() => {
        return driver.element('div.fixed-header');
      })
      .then(result => {
        expect(result.length).to.be.equal(1);
      })
      .tapCatch(console.log);
  });

  it('sticky header should works as expected', function () {
    let scorllingConfig = {
      scrolling: {
        virtualized: true,
        viewport: window,
        header: 'sticky',
      },
    };

    gridView = pgridFactory
      .create(_.extend(scorllingConfig, gridConfig))
      .gridView;

    return new Promise(resolve => gridView.render(resolve))
      .then(() => driver.once(gridView, 'didUpdate'))
      .then(() => {
        return driver.scroll(0, document.body.scrollHeight);
      })
      .then(() => {
        return driver.pause(50);
      })
      .then(() => {
        return driver.element('table.sticky-header');
      })
      .then(result => {
        expect(result.length).to.be.equal(1);
        expect(result.position().top).to.be.equal(0);
      })
      .tapCatch(console.log);
  });

  it('sticky header with numerical offset should works as expected', function () {
    let scorllingConfig = {
      scrolling: {
        virtualized: true,
        viewport: window,
        header: {
          type: 'sticky',
          offset: 10,
        },
      },
    };

    gridView = pgridFactory
      .create(_.extend(scorllingConfig, gridConfig))
      .gridView;

    return new Promise(resolve => gridView.render(resolve))
      .then(() => driver.once(gridView, 'didUpdate'))
      .then(() => {
        return driver.scroll(0, document.body.scrollHeight);
      })
      .then(() => {
        return driver.pause(50);
      })
      .then(() => {
        return driver.element('table.sticky-header');
      })
      .then(result => {
        expect(result.length).to.be.equal(1);
        expect(result.position().top).to.be.equal(10);
      })
      .tapCatch(console.log);
  });

  it('sticky header with function offset should works as expected', function () {
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
      .gridView;
    return new Promise(resolve => gridView.render(resolve))
      .then(() => driver.once(gridView, 'didUpdate'))
      .then(() => {
        return driver.scroll(0, document.body.scrollHeight);
      })
      .then(() => {
        return driver.pause(50);
      })
      .then(() => {
        return driver.element('table.sticky-header');
      })
      .then(result => {
        expect(result.length).to.be.equal(1);
        expect(result.position().top).to.be.equal(15);
      })
      .tapCatch(console.log);
  });

  it('static header should be default when config a non-supported header type', function () {
    let scorllingConfig = {
      scrolling: {
        virtualized: true,
        viewport: window,
        header: 'non-supported type',
      },
    };

    gridView = pgridFactory
      .create(_.extend(scorllingConfig, gridConfig))
      .gridView;

    return new Promise(resolve => gridView.render(resolve))
      .then(() => driver.once(gridView, 'didUpdate'))
      .then(() => {
        return Promise.all([
          driver.element('table.sticky-header'),
          driver.element('div.fixed-header'),
        ]);
      })
      .then(result => {
        expect(result[0].length).to.be.equal(0);
        expect(result[1].length).to.be.equal(0);
      })
      .then(() => {
        return driver.element('#container .table-container table');
      })
      .then(result => {
        expect(result.length).to.be.equal(1);
      })
      .tapCatch(console.log);
  });
});
