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

export function getDefaultColumns(state, columns) {
  return columns || _.chain(state.items.slice(0, 1)).first().keys().map(name => ({
    name,
    sortable: true,
  })).value();
}

// extend headAttribute/bodyAttribute/footAttribute
const getDateColumnAttr = column => ({
  'data-column': column.name || column.property,
});
const getStyleAttr = column => _.isUndefined(column.width) || column.columns ? {} : {
  style: `width: ${column.width}px`,
};

export const extendDataColumnAttr = column => _.defaults({
  headAttributes: _.extend(getDateColumnAttr(column), column.headAttributes),
  bodyAttributes: _.extend(getDateColumnAttr(column), column.bodyAttributes),
  footAttributes: _.extend(getDateColumnAttr(column), column.footAttributes),
}, column);

export const extendWidthAttr = column => _.defaults({
  headAttributes: _.extend(getStyleAttr(column), column.headAttributes),
  bodyAttributes: _.extend(getStyleAttr(column), column.bodyAttributes),
  footAttributes: _.extend(getStyleAttr(column), column.footAttributes),
}, column);

// extend the column attribute recursively
export function extendColumns(columns, extendFunc) {
  return _.map(columns, column => {
    if (column.columns) {
      return _.defaults({ columns: extendColumns(column.columns, extendFunc) }, extendFunc(column));
    }
    return extendFunc(column);
  });
}
