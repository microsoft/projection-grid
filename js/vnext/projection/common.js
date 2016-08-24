import _ from 'underscore';

export function normalizeClasses (classes, row) {
  if(_.isArray(classes)) {
    return classes;
  } else if (_.isString(classes)) {
    return classes.split(/\s+/);
  } else if (_.isFunction(classes)) {
    return classes(row);
  } else if (_.isObject(classes)) {
    return _.chain(classes)
      .pairs()
      .filter(([key, value]) => ((_.isFunction(value) && value(row)) || (!_.isFunction(value) && value)))
      .map(([key, value]) => key)
      .value();
  }
  return [];
}
