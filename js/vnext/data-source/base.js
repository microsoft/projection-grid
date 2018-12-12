import _ from 'underscore';

const defaultPrimaryKey = '__primary_key__';

/**
 * The base class for all data sources.
 * @class DataSource
 * @param {string} [primaryKey='__primary_key__']
 *    The primary key of the entity set.
 */
export class DataSource {

  constructor(primaryKey = defaultPrimaryKey) {
    this._primaryKey = primaryKey;
  }

  /**
   * The primary key of the data source.
   * @type {string}
   */
  get primaryKey() {
    return this._primaryKey;
  }

  /**
   * Query the data source with given parameters
   * @param {object} params - The query parameters
   */
  query(params) {
    return {
      items: [],
      totalCount: 0,
    };
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
  normalizeOrderBy(orderBy = []) {

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

      if (!direction) {
        return memo;
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
        return memo.concat(this.normalizeOrderBy(key(direction)));
      }

      if (_.isString(key)) {
        memo.push([key, direction]);
        return memo;
      }

      throw new Error('Invalid key option for orderBy');
    }, []);
  }

}

