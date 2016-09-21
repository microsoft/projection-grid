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

/**
 * The order-by configuration for the data source.
 * @typedef OrderByConfig
 * @type {OrderByItem|OrderByItem[]}
 */

/**
 * A [key: string, direction: number] pair.
 * @typedef NormalizedOrderByPair
 * @type {array}
 */

/**
 * Normalize the orderby parameter for data source.
 * @param {OrderByConfig} orderBy
 * @return {NormalizedOrderByPair[]}
 */
export function normalizeOrderBy(orderBy) {

  /**
   * A single order-by item with key and direction.
   * @typedef OrderByItem
   * @type {OrderByObject|OrderByPair}
   */
  return _.reduce(_.isArray(orderBy) ? orderBy : [orderBy], (memo, item) => {
    let key = null;
    let direction = null;
    let dirString = null;

    /**
     * A [key: OrderByKey, direction: number] pair.
     * @typedef OrderByPair
     * @type {array}
     */
    if (_.isArray(item)) {
      key = item[0];
      direction = item[1];
    }

    /**
     * @typedef OrderByObject
     * @type {object}
     * @property {OrderByKey} key - The key off the order by item
     * @property {number} direction - The direction of the order by item, positive
     * for ascending, non-positive for descending
     */
    if (_.isObject(item)) {
      key = item.key;
      direction = item.direction;
    }

    if (!_.isNumber(direction)) {
      throw new Error('Invalid direction option for orderBy');
    }

    /**
     * Represents an order by key
     *  * When it's a string, it's the key path of the sorting value.
     *  * When it's a callback, it takes a direction, and return a normalized
     *    order config.
     * @typedef OrderByKey
     * @type {string|OrderByCallback}
     */
    if (_.isFunction(key)) {
      /**
       * @callback OrderByCallback
       * @param {number} direction - The direction of the order by item
       * @return {OrderByConfig}
       */
      return memo.concat(normalizeOrderBy(key(direction)));
    }

    if (_.isString(key)) {
      memo.push([key, direction]);
      return memo;
    }

    throw new Error('Invalid key option for orderBy');
  }, []);
}

