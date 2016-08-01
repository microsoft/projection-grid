import _ from 'underscore';

export function jsdata ({
  query,
  entity,
  options,
  skip,
  take,
  filter,
  orderby = [],
  select = [],
} = {}) {
  const op = {};

  if (take) {
    op.limit = take;
  }

  if (skip) {
    op.offset = skip;
  }

  if (filter) {
    op.where = filter;
  }

  if (query) {
    op.query = query;
  }

  if (orderby && orderby.length) {
    op.orderby = _.reduce(orderby, (memo, obj) => {
      _.each(obj, (key, value) => {memo.push([key, value > 0 ? 'ASC' : 'DESC']);});
      return memo;
    }, []);
  }

  return entity.findAll(op, _.defaults(options, { all: true }))
  	.then(function(data) {
  		return { items: data };
  	});
};
