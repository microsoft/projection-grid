import _ from 'underscore';

export function normalizeClasses (classes, context) {
  if(_.isArray(classes)) {
    return classes;
  } else if (_.isString(classes)) {
    return classes.split(/\s+/);
  } else if (_.isFunction(classes)) {
    return classes(context);
  } else if (_.isObject(classes)) {
    return _.chain(classes)
      .pairs()
      .filter(([key, value]) => ((_.isFunction(value) && value(context)) || (!_.isFunction(value) && value)))
      .map(([key, value]) => key)
      .value();
  }
  return [];
}
