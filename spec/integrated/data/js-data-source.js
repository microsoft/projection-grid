import _ from 'underscore';
import JSData from 'js-data';
import DSHttpAdapter from 'js-data-http';

JSData.DSUtils.Promise = require('bluebird');
let store = new JSData.DS();

store.registerAdapter('http', new DSHttpAdapter({
  basePath: 'https://services.odata.org/V4/Northwind/Northwind.svc/',
  deserialize: (definition, response) => {
    return response.data.value;
  },
  queryTransform: (definition, params) => {
    let query = {};

    _.has(params, 'offset') && (query.$skip = params.offset);
    _.has(params, 'limit') && (query.$top = params.limit);
    _.has(params, 'orderBy') && (query.$orderby = params.orderBy.map((item) => {
      return item[0] + ' ' + item[1].toLowerCase();
    }).join(','));

    return query;
  },
}), { default: true });

module.exports = store.defineResource({
  name: 'Customers',
  idAttribute: 'CustomerID',
});
