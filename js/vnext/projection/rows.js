import _ from 'underscore';

const bufferStateClasses = {
  'changed': ['row-buffer-changed'],
  'committed': ['row-buffer-committed'],
};

/**
* Handling bodyRows and adding headRows, bodyRows, footRows to state
* 
* @param {Object} state
* @param {Object} [state.items] Original data from data source
* @param {Object[]} headRows User defined configuration. 'headRows' takes a default string 'column-header-rows'
* @param {Object[]} footRows User defined configuration
*/
function normalize (classes, row) {
  let normalizedClass = [];
  if(_.isArray(classes)) {
    normalizedClass = classes;
  } else if (_.isString(classes)) {
    _.each(classes.split(/\s+/), c => normalizedClass.push(c));
  } else if (_.isFunction(classes)) {
    normalizedClass = classes(row);
  } else if (_.isObject(classes)) {
    _.mapObject(classes, (value, key) => {
      if((_.isFunction(value) && value(row)) || (!_.isFunction(value) && value)) {
        normalizedClass.push(key);
      } 
    });
  }
  return normalizedClass;
}

export function rows(state, {
  headRows = ['column-header-rows'],
  footRows = [],
  bodyRows = [{ name: 'data-rows' }],
} = {}) {
  const primaryKey = state.primaryKey;
  const changed = this.get('buffer').changed || {};
  const stateItems = state.items.slice(0, state.items.length);
  const body = _.reduce(bodyRows, (memo, row) => {
    if (row === 'data-rows' || row.name === 'data-rows'){
      _.each(stateItems, stateItem => memo.push(_.extend({}, row, stateItem)));
    } else {
      memo.push(row);
    }
    return memo;
  }, []);
  const bodyItems = {
    length: body.length, 
    slice: (...args) => body.slice(...args).map(item => {
      const key = item[primaryKey];
      const state = _.chain(changed).result(key).result('state').value();
      const classes = _.union(normalize(item.classes, item), _.result(bufferStateClasses, state, []));
      return item.html ? { classes, html: item.html } : { classes, item };
    }),
  };
  return _.defaults({ headRows, bodyRows: bodyItems, footRows }, state);
}

