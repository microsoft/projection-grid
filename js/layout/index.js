module.exports = {
  TableLayout: require('./table'),
  templates: {
    table: require('./template/table.jade'),
  },
  renderers: require('./renderer/index'),
};
