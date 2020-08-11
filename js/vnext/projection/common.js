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
 *    * An object representing the data item for data rows in the body
 *
 * @return {string[]}
 *    The normalized classes configuration.
 */
export function normalizeClasses(classes, context) {
  if (_.isArray(classes)) {
    return classes;
  } else if (_.isString(classes)) {
    return classes.split(/\s+/);
  } else if (_.isFunction(classes)) {
    return classes(context);
  } else if (_.isObject(classes)) {
    return _.chain(classes)
      .pairs()
      .filter(([, value]) => {
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
      .map(([key]) => key)
      .value();
  }
  return [];
}

/**
 * Normalize the attributes configuration
 * @param {AttributesConfig} attributes
 *    The attributes configuration.
 * @param {Object} context
 *    The context for the classes. It could be
 *    * A {@link ColumnConfig} for a column's headAttributes/colAttributes
 *    * A {@link RowConfig} for a column or row's bodyAttributes/footAttributes
 *    * An object representing the data item for data rows in the body
 * @return {Object.<string, string>}
 *    The normalized attributes configuration.
 */
export function normalizeAttributes(attributes, context) {
  if (_.isFunction(attributes)) {
    return normalizeAttributes(attributes(context));
  }

  if (_.isObject(attributes)) {
    return _.mapObject(attributes, value => (_.isFunction(value) ? value(context) : value));
  }

  return {};
}

/**
 * Normalize the attributes configuration
 * @param {ColumnConfig} column 
 *    The column config.
 * @return {ColumnConfig}
 *    The column config with attribute.
 */
export const extendDataColumnAttribute= (column) => _.defaults({
  headAttributes: _.extend({
    'data-column': column.name || column.property,
  }, column.headAttributes),

  bodyAttributes: _.extend({
    'data-column': column.name || column.property,
  }, column.bodyAttributes),

  footAttributes: _.extend({
    'data-column': column.name || column.property,
  }, column.footAttributes),
}, column);
