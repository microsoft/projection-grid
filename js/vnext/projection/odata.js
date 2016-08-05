import _ from 'underscore';
import $ from 'jquery';
import Promise from 'bluebird';

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
      const { key, direction } = _.first(orderby) || {};
      op.$orderby = key + ' ' + (direction > 0 ? 'asc' : 'desc');
    }

    return new Promise((resolve, reject) => {
      $.getJSON(_.result(op, 'url'), _.omit(op, 'url'))
        .success(resolve)
        .fail((jqXHR, textStatus, errorThrown) => {
          reject(new Error(errorThrown));
        });
    }).then(data => ({ items: data.value || [] }));
  },

  update(item, { url }) {
    return new Promise(resolve => window.setTimeout(() => resolve(item), 3000));
  }
};

