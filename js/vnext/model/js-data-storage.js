import _ from 'underscore';

import Promise from 'bluebird';
import { Storage } from './storage.js';

export class JSDataStorage extends Storage {
  constructor(options) {
    super(options);
    this.entity = options.entity;
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
      .then(data => ({
        items: data,
        itemCount: data.totalCount || 0,
      }));
  }
  
  create(attrs) {
    return this.entity.create(attrs);
  }

  update(key, attrs) {
    throw new Error('Not implemented');
  }

  destroy(key) {
    throw new Error('Not implemented');
  }
  
}

