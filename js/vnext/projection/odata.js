import _ from 'underscore';
import $ from 'jquery';
import Promise from 'bluebird';

export function odata (state, {
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
    const col = _.first(orderby);
    const key = _.keys(col)[0];
    const dir = col[key];

    op.$orderby = key + ' ' + (dir > 0 ? 'asc' : 'desc');
  }

  return new Promise((resolve, reject) => {
    $.getJSON(_.result(op, 'url'), _.omit(op, 'url'))
      .success(resolve)
      .fail((jqXHR, textStatus, errorThrown) => {
        reject(new Error(errorThrown));
      });
  }).then(data => ({ items: data.value || [] }));
}


