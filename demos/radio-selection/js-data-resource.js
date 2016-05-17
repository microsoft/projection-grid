var _ = require('underscore');
var JSData = require('js-data');
var DSHttpAdapter = require('js-data-http');

class ODataAdapter extends DSHttpAdapter {

  constructor(options) {
    super(_.extend(options, {
      queryTransform(definition, params) {
        var query = { $count: true };

        _.has(params, 'offset') && (query.$skip = params.offset);
        _.has(params, 'limit') && (query.$top = params.limit);
        _.has(params, 'orderBy') && (query.$orderby = params.orderBy.map(function (item) {
          return item[0] + ' ' + item[1].toLowerCase();
        }).join(','));

        return query;
      },
    }));
  }

  findAll(definition, params, options) {
    let totalCount = 0;

    options.afterFindAll = (resource, data) => {
      totalCount = data['@odata.count'];
      return data.value;
    };
    options.afterInject = (resource, instances) => {
      Object.defineProperty(instances, 'totalCount', { value: totalCount });
    };

    return super.findAll(definition, params, options);
  }
}

JSData.DSUtils.Promise = require('bluebird');

var store = new JSData.DS();
store.registerAdapter('odata', new ODataAdapter({
  basePath: 'http://services.odata.org/V4/Northwind/Northwind.svc/',
}), { default: true });

module.exports = store.defineResource({
  name: 'Customers',
  idAttribute: 'CustomerID',
});
