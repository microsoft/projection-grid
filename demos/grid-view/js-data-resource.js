var _ = require('underscore');
var JSData = require('js-data');
var DSHttpAdapter = require('js-data-http');

JSData.DSUtils.Promise = require('bluebird');

var store = new JSData.DS();
store.registerAdapter('http', new DSHttpAdapter({
  basePath: 'http://services.odata.org/V4/Northwind/Northwind.svc/',
  deserialize: function (definition, response) {
    return response.data.value;
  },
  queryTransform: function (definition, params) {
    var query = {};

    _.has(params, 'offset') && (query.$skip = params.offset);
    _.has(params, 'limit') && (query.$top = params.limit);
    _.has(params, 'orderBy') && (query.$orderby = params.orderBy.map(function (item) {
      return item[0] + ' ' + item[1].toLowerCase();
    }).join(','));

    return query;
  },
}), { default: true });

module.exports = store.defineResource({
  name: 'Customers',
  idAttribute: 'CustomerID',
});
