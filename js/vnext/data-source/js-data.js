import _ from 'underscore';
import { DataSource } from './base.js';

function translateOrderBy(dataSource, orderByParams) {
  const orderBy = _.chain(dataSource.normalizeOrderBy(orderByParams))
    .map(([key, direction]) => [
      key,
      direction > 0 ? 'ASC' : 'DESC',
    ])
    .value();

  return _.isEmpty(orderBy) ? null : orderBy;
}

function translateParams(dataSource, params) {
  return _.chain(params)
    .omit('skip', 'take', 'filter', 'orderby')
    .extend(_.pick({
      offset: params.skip,
      limit: params.take,
      where: params.filter,
      orderBy: translateOrderBy(dataSource, params.orderby),
    }, Boolean))
    .value();
}

/**
 * Data source from a JSData resource
 * @class JSDataDataSource
 * @param {JSDataResource} resource
 *    The JSData resource representing the entity set.
 * @param {Object} options
 *    The query options. You can use it add JSData life cycle hooks.
 */
export class JSDataDataSource extends DataSource {
  constructor(resource, options = {}) {
    super(resource.idAttribute);
    this._resource = resource;
    this._options = options;
  }

  query(params) {
    const options = _.defaults({}, params.options, this._options);

    return this._resource
      .findAll(translateParams(this, _.omit(params, 'options')), options)
      .then(data => ({
        items: data.slice(),
        totalCount: data.totalCount || 0,
      }));
  }

  get resource() {
    return this._resource;
  }
}

