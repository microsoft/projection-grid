import _ from 'underscore';

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
      .filter(([key, value]) => ((_.isFunction(value) && value(context)) || (!_.isFunction(value) && value)))
      .map(([key, value]) => key)
      .value();
  }
  return [];
}

/**
 * @typedef OrderByConfig
 * @type {OrderByItem|OrderByItem[]}
 *
 * @typedef OrderByItem
 * @type {OrderByObject|OrderByPair}
 *
 * @typedef OrderByObject
 * @type {object}
 * @property {OrderByKey} key - The key off the order by item
 * @property {number} direction - The direction of the order by item, positive
 * for ascending, non-positive for descending
 *
 * @desc A [key: OrderByKey, direction: number] pair.
 * @typedef OrderByPair
 * @type {array}
 *
 * @typedef OrderByKey
 * @type {string|OrderByCallback}
 *
 * @callback OrderByCallback
 * @param {number} direction - The direction of the order by item
 * @return {OrderByConfig}
 *
 * @desc A [key: string, direction: number] pair.
 * @typedef NormalizedOrderByPair
 * @type {array}
 */

/**
 * @param {OrderByConfig} orderBy
 * @return {NormalizedOrderByPair[]}
 */
export function normalizeOrderBy(orderBy) {
  return _.reduce(_.isArray(orderBy) ? orderBy : [orderBy], (memo, item) => {
    let key = null;
    let direction = null;
    let dirString = null;

    if (_.isArray(item)) {
      key = item[0];
      direction = item[1];
    }

    if (_.isObject(item)) {
      key = item.key;
      direction = item.direction;
    }

    if (!_.isNumber(direction)) {
      throw new Error('Invalid direction option for orderBy');
    }

    if (_.isFunction(key)) {
      return memo.concat(normalizeOrderBy(key(direction)));
    }

    if (_.isString(key)) {
      memo.push([key, direction]);
      return memo;
    }

    throw new Error('Invalid key option for orderBy');
  }, []);
}

