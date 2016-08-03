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
    op.orderby = _.map(orderby, ({ key, direction }) => [key, direction > 0 ? 'ASC' : 'DESC']);
  }

  return entity.findAll(op, _.defaults(options, { all: true }))
  	.then(function(data) {
  		return { items: data };
  	});
};

