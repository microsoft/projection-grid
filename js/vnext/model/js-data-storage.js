import _ from 'underscore';
import $ from 'jquery';

import Promise from 'bluebird';
import { Storage } from './storage.js';

export class JSDataStorage extends Storage {
  constructor(options) {
    super(options);
    this.entity = options.entity;
    this.etag = '*';
  }

  read({
    filter,
    orderBy,
    skip,
    take,
    params,
  }) {
    const options = {};

    if (_.isNumber(take)) {
      options.limit = take;
    }

    if (_.isNumber(skip)) {
      options.offset = skip;
    }

    if (filter) {
      options.where = filter;
    }

    if (params) {
      options.query = params;
    }

    if (orderBy && orderBy.length) {
      options.orderby = _.map(orderBy, ({ key, direction }) => [
        key,
        direction > 0 ? 'ASC' : 'DESC',
      ]);
    }

    return this.entity.findAll(options, { all: true })
      .then(data => {
        const itemCount = _.isArray(data) ? data.length : (data.totalCount || 0);
        const itemIndex = {};

        _.each(items, item => {
          itemIndex[item[this.primaryKey]] = item;
        });

        this.etag = _.isArray(data) ? data[0]['@odata.etag'] : data.etag;

        return {
          uniqueId: _.uniqueId('grid-data-'),
          items: data,
          itemIndex,
          primaryKey: this.primaryKey,
          update: _.noop,
          itemCount,
        };
    }).bind(this);
  }
  
  create(attrs) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: this.entity.basePath + '/' + this.entity.name,
        type: 'POST',
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify(attrs),
      })
      .done(resolve)
      .fail((jqXHR, textStatus, errorThrown) => reject([new Error(errorThrown), attrs, 'create']));
    });
    //return this.entity.create(attrs);
  }

  update(key, attrs) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: this.entity.basePath + '/' + this.entity.name + "('" + key + "')",
        type: 'PATCH',
        headers: { 
          "Content-Type": "application/json",
          "If-Match" : this.etag,
        },
        data: JSON.stringify(attrs),
      })
      .done(resolve)
      .fail((jqXHR, textStatus, errorThrown) => reject([new Error(errorThrown), key, 'update']));
    });
  }

  destroy(key) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: this.entity.basePath + '/' + this.entity.name + "('" + key + "')",
        type: 'DELETE',
        headers: {
          "If-Match" : this.etag,
        }
      })
      .done(resolve)
      .fail((jqXHR, textStatus, errorThrown) => reject([new Error(errorThrown), key, 'destroy']));
    });
  }
  
}

