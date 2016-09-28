import _ from 'underscore';
import $ from 'jquery';
import Promise from 'bluebird';
import { DataSource } from './base.js';

function translateOrderBy(dataSource, orderByParams) {
  return _.chain(dataSource.normalizeOrderBy(orderByParams))
    .map(([key, direction]) => `${key} ${direction > 0 ? 'asc' : 'desc'}`)
    .join(',')
    .value();
}

function translateParams(dataSource, params) {
  return _.chain(params)
    .omit('skip', 'take', 'filter', 'orderby')
    .extend(_.pick({
      $skip: params.skip,
      $top: params.take,
      $filter: params.filter,
      $orderby: translateOrderBy(dataSource, params.orderby),
      $count: true,
    }, Boolean))
    .value();
}

export class ODataDataSource extends DataSource {
  constructor(url, primaryKey) {
    super(primaryKey);
    this._url = url;
  }

  query(params) {
    return new Promise((resolve, reject) => {
      $.getJSON(this._url, translateParams(this, params))
        .success(resolve)
        .fail((jqXHR, textStatus, errorThrown) => {
          reject(new Error(errorThrown));
        });
    }).then(data => ({
      items: data.value || [],
      totalCount: data['@odata.count'] || 0,
    }));
  }
}

