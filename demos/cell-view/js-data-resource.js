import _ from 'underscore';
import JSData from 'js-data';
import DSHttpAdapter from 'js-data-http';

class ODataAdapter extends DSHttpAdapter {

  constructor(options) {
    super(_.extend(options, {
      queryTransform(definition, params) {
        const query = { $count: true };

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

const store = new JSData.DS();
store.registerAdapter('odata', new ODataAdapter({
  basePath: 'http://services.odata.org/V4/Northwind/Northwind.svc/',
}), { default: true });

export default store.defineResource({
  name: 'Customers',
  idAttribute: 'CustomerID',
});
