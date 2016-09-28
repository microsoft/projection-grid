import _ from 'underscore';
import {
  DataSource,
  ODataDataSource,
  JSDataDataSource,
  MemoryDataSource,
} from '../data-source';

/**
 * @typedef DataSourceConfig
 * @type {DataSource|BuiltinDataSourceConfig}
 */

/**
 * @typedef BuiltinDataSourceConfig
 * @type {Object}
 * @property {string} type
 *    The builtin data source type, available values are 'odata', 'js-data'
 *    and 'memory'.
 * @property {string?} primaryKey
 *    The primaryKey for the data source. Required by 'odata' and 'memory'
 *    data sources.
 * @property {JSDataResource?} entity
 *    The JSDataResource representing the entity set. Required by 'js-data'
 *    data source.
 * @property {string?} url
 *    The URL for the entity set. Required by 'odata' data source.
 * @property {Object[]} data
 *    The in-memory data set. Required by 'memory' data source.
 *
 */

export default definePlugin => definePlugin('dataSource', ['config'], config => {
  const dataSource = _.result(config, 'dataSource', {});

  if (dataSource instanceof DataSource) {
    return dataSource;
  }

  const { type, primaryKey } = dataSource;

  if (type === 'memory') {
    return new MemoryDataSource(dataSource.data, primaryKey);
  }

  if (type === 'odata') {
    return new ODataDataSource(dataSource.url, primaryKey);
  }

  if (_.contains(['jsdata', 'js-data'], type)) {
    return new JSDataDataSource(dataSource.entity, dataSource.options);
  }

  throw new Error('Unsupported data source type');
});

