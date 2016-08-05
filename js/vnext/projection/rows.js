import _ from 'underscore';

const bufferStateClasses = {
  'changed': ['row-buffer-changed'],
  'committed': ['row-buffer-committed'],
};

export function rows(state, {
  headRows = ['column-header-rows'],
  footRows = [],
} = {}) {
  const primaryKey = state.primaryKey;
  const changed = this.get('buffer').changed || {};
  const bodyRows = {
    length: state.items.length,
    slice: (...args) => state.items.slice(...args).map(item => {
      const key = item[primaryKey];
      const state = _.chain(changed).result(key).result('state').value();
      const classes = _.result(bufferStateClasses, state, []);

      return { classes, item };
    }),
  };
  return _.defaults({ headRows, bodyRows, footRows }, state);
}

