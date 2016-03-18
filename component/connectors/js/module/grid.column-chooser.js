define([], function() {
  function Connector(grid, columnChooser) {
    this.grid = grid;
    this.columnChooser = columnChooser;
  }

  Connector.prototype.connect = function() {
    this.columnChooser.on('change:columns', columns, this);
  };

  Connector.prototype.disconnect = function() {
    this.columnChooser.off('change:columns', columns, this);
  };

  function columns(arg) {
    this.grid.projection.set('column.in', arg);
  }

  return Connector;
});
