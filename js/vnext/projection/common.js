import _ from 'underscore';

/**
 * The classes configuration. It could be
 *    * A array of class strings
 *    * A space separated classes string
 *    * A hash from class names to {@link ClassPredicate}
 * @typedef ClassesConfig
 * @type {(string[]|string|Object.<string, ClassPredicate>)}
 */

/**
 * Normalize the classes configuration
 * @param {ClassesConfig} classes
 *    The classes configuration.
 * @param {Object} context
 *    The context for the classes. It could be
 *    * A {@link ColumnConfig} for a column's headClasses/colClasses
 *    * A {@link RowConfig} for a column or row's bodyClasses/footClasses
 *
 * @return {string[]}
 *    The normalized classes configuration.
 */
export function normalizeClasses(classes, context) {
  if(_.isArray(classes)) {
    return classes;
  } else if (_.isString(classes)) {
    return classes.split(/\s+/);
  } else if (_.isFunction(classes)) {
    return classes(context);
  } else if (_.isObject(classes)) {
    return _.chain(classes)
      .pairs()
      .filter(([key, value]) => {
        /**
         * A boolean or a callback to decide whether or not a class is applied.
         * When it's a function, it takes the context and return a boolean.
         * @typedef ClassPredicate
         * @type {(boolean|ClassPredicateCallback)}
         */
        const isFunc = _.isFunction(value);

        /**
         * @callback ClassPredicateCallback
         * @param {Object} context
         *    Refer to the `context` of {@link normalizeClasses}.
         * @return {boolean}
         *    Whether or not the class is applied.
         */
        return (isFunc && value(context)) || (!isFunc && Boolean(value));
      })
      .map(([key, value]) => key)
      .value();
  }
  return [];
}

