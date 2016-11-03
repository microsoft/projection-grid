import $ from 'jquery';
import _ from 'underscore';
import pGrid from 'component/grid';
import chai from 'chai';
import util from 'util';
import driver from 'driver';
import peopleData from 'data/people.json';
import '../styles/tri-state-checkbox.css';

let Grid = pGrid.GridView;
let TableLayout = pGrid.layout.TableLayout;
let tmplJade = pGrid.layout.templates.table;

let expect = chai.expect;
let memoryDataSource = _.map(peopleData.value, (row) => {
  return _.pick(row, 'UserName', 'FirstName', 'LastName', 'Gender', 'Concurrency');
});
let memoryHeader = _.keys(_.first(memoryDataSource));
let memoryData = util.getExpectedGridData(memoryDataSource);


let map = new pGrid.projections.Map({
  map: function(item) {
    return _.pick(item, 'UserName', 'FirstName', 'LastName', 'Gender', 'Concurrency');
  }
});

let columns = new pGrid.projections.Columns({
  columns: {
    UserName: {},
    FirstName: {},
    LastName: {},
    Gender: {},
    Concurrency: {},
  },
});

let coli18n = new pGrid.projections.ColumnI18n({
  'column.i18n': {
    'UserName': 'UserName',
    'FirstName': 'FirstName',
    'LastName': 'LastName',
    'Gender': 'Gender',
    'Concurrency': 'Concurrency',
  },
});


let pgrid;
let pgridFactory;
let gridView;

describe('unencapsulating projection test for non-vnext', function () {
  this.timeout(1000000);
  let headRowSelector = '#container .grid thead .table__row--header';
  let bodyRowSelector = '#container .grid tbody .table__row--body';

  beforeEach(function () {
    util.renderTestContainer();
  });
  
  afterEach(() => {
    gridView.remove();
    util.cleanup();
  });

  it('editable string should works as expected for non-vnext', function (done) {
    let editableString = new pGrid.projections.EditableString({
      'column.editable.string': {
        Concurrency: {
        },
      },
    });
    let dataSource = new pGrid.projections.Memory({
      seed: peopleData.value,
    });

    let projectionSetting = dataSource
      .pipe(map).pipe(columns).pipe(coli18n)
      .pipe(editableString);

    let grid = new Grid({
      el: '#container',
      projection: projectionSetting,
      Layout: TableLayout.partial({
        template: tmplJade,
        renderers: [],
      }),
    });
    gridView = grid.render({ fetch: true });
    driver.element(bodyRowSelector)
      .then((result) => {
        _.each(result, (rowItem) => {
          let assertion = $(rowItem).find('td').last().find('input').hasClass('grid-text-input');
          expect(assertion).to.be.true;
        });
      })
      .then(done)
      .catch(console.log);
  });

  it('row-tri-state-checkbox should works as expected for non-vnext', function (done) {
    let RowTriStateCheckboxProjection = pGrid.projections.RowTriStateCheckboxProjection;
    let preCheckMap = {
      russellwhyte: {
        id: 'russellwhyte',
        state: 'indeterminate',
        transition: RowTriStateCheckboxProjection.CheckTransitionRule.indeterminateToCheckedFullCycle,
      },
    };
    let rowTriState = new RowTriStateCheckboxProjection({
      'row.check.id': 'UserName',
      'column.checked': 'checkbox',
    });
    
    rowTriState.set('row.check.map', _.clone(preCheckMap));
    let colq = new pGrid.projections.ColumnQueryable({
      'column.lock': ['checkbox', 'UserName'],
    });

    let dataSource = new pGrid.projections.Memory({
      seed: peopleData.value,
    });

    let projectionSetting = dataSource
      .pipe(map).pipe(columns).pipe(coli18n).pipe(colq)
      .pipe(rowTriState);

    let grid = new Grid({
      el: '#container',
      projection: projectionSetting,
      Layout: TableLayout.partial({
        template: tmplJade,
        renderers: [],
      }),
    });

    gridView = grid.render({ fetch: true });
    let headCheckboxSelector = '#container thead .column-tri-state-checkbox';
    let bodyCheckboxSelector = '#container tbody .column-tri-state-checkbox';

    driver.element(bodyCheckboxSelector)
      .then((result) => {
        let checkMap = gridView.projection.get('row.check.map');
        let status = RowTriStateCheckboxProjection.statCheckMap(preCheckMap);

        expect(checkMap).to.eql(preCheckMap);
        expect(_.first(status.indeterminate)).to.eql(preCheckMap.russellwhyte);
        expect(result.length).to.equal(16);
        expect(result.first().find('span').hasClass('glyphicon-minus')).to.be.true;
        return driver.click(result.first());
      })
      .then(() => {
        let preStatus = RowTriStateCheckboxProjection.statCheckMap(preCheckMap);
        let currentCheckMap = gridView.projection.get('row.check.map');
        let diff = RowTriStateCheckboxProjection.diffCheckMap(preCheckMap, currentCheckMap);
        let addedLog = diff.added;
        let changedLog = diff.changed;
        let removedLog = diff.removed;
        let unchangedLog = diff.unchanged;

        expect(_.isEmpty(addedLog) && _.isEmpty(removedLog) && _.isEmpty(unchangedLog)).to.be.true;
        expect(_.has(changedLog, 'russellwhyte')).to.be.true;
        expect(changedLog.russellwhyte.before).to.eql(preCheckMap.russellwhyte);
        expect(changedLog.russellwhyte.after).to.eql(currentCheckMap.russellwhyte);
        return driver.element(bodyCheckboxSelector);
      })
      .then((result) => {
        expect(result.first().find('span').hasClass('glyphicon-ok')).to.be.true;
        return driver.click(result.first());
      })
      .then(() => {
        return driver.element(bodyCheckboxSelector);
      })
      .then((result) => {
        expect(result.first().find('span:not([class])').length).to.equal(1);
      })
      .then(() => {
        return driver.element(headCheckboxSelector);
      })
      .then((result) => {
        return driver.click(result.first());
      })
      .then(() => {
        return driver.element(bodyCheckboxSelector);
      })
      .then((result) => {
        _.each(result, (checkbox) => {
          let assertion = $(checkbox).find('span').hasClass('glyphicon-ok');
          expect(assertion).to.be.true;
        });
      })
      .then(() => {
        return driver.element(headCheckboxSelector);
      })
      .then((result) => {
        return driver.click(result.first());
      })
      .then(() => {
        return driver.element(bodyCheckboxSelector);
      })
      .then((result) => {
        _.each(result, (checkbox) => {
          let checkboxSpan = $(checkbox).find('span:not([class])');
          expect(checkboxSpan.length).to.equal(1);
        });
      })
      .then(done)
      .catch(console.log);
  });

  it('mock should works as expected for non-vnext', function (done) {
    let mockMap = new pGrid.projections.Map({
      map: function(item) {
        return _.pick(item, 'index', 'name', 'age');
      }
    });
    
    let mockColumns = new pGrid.projections.Columns({
      columns: {
        index: {},
        name: {},
        age: {},
      },
    });
    
    let mockColi18n = new pGrid.projections.ColumnI18n({
      'column.i18n': {
        'index': 'index',
        'name': 'name',
        'age': 'age',
      },
    });
    let mock = new pGrid.projections.Mock({n: 10});

    let projectionSetting = mock
      .pipe(mockMap).pipe(mockColumns).pipe(mockColi18n)

    let grid = new Grid({
      el: '#container',
      projection: projectionSetting,
      Layout: TableLayout.partial({
        template: tmplJade,
        renderers: [],
      }),
    });
    gridView = grid.render({ fetch: true });
    driver.element(bodyRowSelector)
      .then((result) => {
        expect(result.length).to.equal(10);
      })
      .then(done)
      .catch(console.log);
  });
});
