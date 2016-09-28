import _ from 'underscore';
import {
  DataSource,
  ODataDataSource,
  JSDataDataSource,
  MemoryDataSource,
} from '../data-source';

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

