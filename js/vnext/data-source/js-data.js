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

export class JSDataDataSource extends DataSource {
  constructor(resource, options = {}) {
    super(resource.idAttribute);
    this._resource = resource;
    this._options = options;
  }

  query(params) {
    return this._resource.findAll(translateParams(this, params), this._options)
      .then(data => ({
        items: data.slice(),
        totalCount: data.totalCount || 0,
      }));
  }
}

