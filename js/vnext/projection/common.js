import _ from 'underscore';

export function normalizeClass (classes, row) {
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
