import _ from 'underscore';
import $ from 'jquery';
import Promise from 'bluebird';
import { Storage } from './storage.js';

export class ODataStorage extends Storage {
  constructor(options) {
    super(options);
    this.url = options.url;
  }

  read({
    skip,
    take,
    filter,
    orderBy,
  }) {
    const options = {
      url: this.url,
      $format: 'json',
      $count: true,
    };

    if (_.isNumber(take)) {
      options.$top = take;
    }

    if (_.isNumber(skip)) {
      options.$skip = skip;
    }

    if (_.size(orderBy)) {
      const { key, direction } = _.first(orderBy) || {};
      const dirStr = direction > 0 ? 'asc' : 'desc';

      options.$orderby = `${key} ${dirStr}`;
    }

    return new Promise((resolve, reject) => {
      $.getJSON(_.result(options, 'url'), _.omit(options, 'url'))
        .success(resolve)
        .fail((jqXHR, textStatus, errorThrown) => reject(new Error(errorThrown)));
    }).then(data => {
      const items = data.value || [];
      const itemCount = data['@odata.count'] || 0;
      const itemIndex = {};

      _.each(items, item => {
        itemIndex[item[this.primaryKey]] = item;
      });

      return {
        uniqueId: _.uniqueId('grid-data-'),
        items,
        itemIndex,
        primaryKey: this.primaryKey,
        update: _.noop,
        itemCount,
      };
    }).bind(this);
  }

  /*
  update(id, attrs) {
    return new Promise(resolve => window.setTimeout(() => resolve(attrs), 3000));
  }
  */
  create(attrs) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: this.url,
        type: 'POST',
        header: { "Content-Type": "application/json" },
        data: JSON.stringify(attrs),
      }).success(resolve);
    }); 
  }

  update(key, attrs) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: this.url + "('" + key + "')",
        type: 'PATCH',
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(attrs),
      }).success(resolve);
    });
  }

  destroy(key) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: this.url+ "('" + key + "')",
        type: 'DELETE',
      }).success(resolve);
    });
  }
}

