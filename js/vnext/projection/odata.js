import _ from 'underscore';
import $ from 'jquery';
import Promise from 'bluebird';
import { normalizeOrderBy } from './common.js';

/**
* odata data source
*/
export const odata = {
  findAll({
    verb = 'get',
    url,
    skip,
    take,
    filter,
    orderby = [],
    select = [],
  } = {}) {

    const op = {
      url,
      $format: 'json',
      $count: true,
    };

    if (take) {
      op.$top = take;
    }

    if (skip) {
      op.$skip = skip;
    }

    if (_.size(orderby)) {
      op.$orderby = _.chain(normalizeOrderBy(orderby))
        .map(([key, direction]) => `${key} ${direction > 0 ? 'asc' : 'desc'}`)
        .join(',')
        .value();
    }

    return new Promise((resolve, reject) => {
      $.getJSON(_.result(op, 'url'), _.omit(op, 'url'))
        .success(resolve)
        .fail((jqXHR, textStatus, errorThrown) => {
          reject(new Error(errorThrown));
        });
    }).then(data => ({ items: data.value || [] , itemCount: data['@odata.count'] || 0, }));
  },

  update(item, { url }) {
    return new Promise(resolve => window.setTimeout(() => resolve(item), 3000));
  }
};

