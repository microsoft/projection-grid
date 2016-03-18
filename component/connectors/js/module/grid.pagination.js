define([
  'lib/underscore',
  'component/state/index'
  ],
function (
  _,
  state) {
  // todo [akamel] should we use this instead of closure for grid and pagination?
  function Connector(grid, pagination) {
    this.grid = grid;
    this.pagination = pagination;

    this.next = function(e, arg){
      grid.projection.set('page.number', arg.page_number + 1);
    };

    this.previous = function(e, arg){
      grid.projection.set('page.number', arg.page_number - 1);
    };

    this.number = function(e, arg){
      grid.projection.set('page.number', arg.page_number);
    };

    this.size = function(e, arg){
      if (_.isString(grid.gridPageSizeKey)) {
        state.set(grid.gridPageSizeKey, arg.page_size);
      }

      grid.projection.set({
        'page.number' : 0,
        'page.size'   : arg.page_size
      });
    };

    this.data = function(model){
      var page_number = grid.projection.get('page.number')
        , page_size   = grid.projection.get('page.size')
        ;

      pagination.ko_model.page_number(page_number);
      pagination.ko_model.page_size(page_size);
      pagination.ko_model.item_count(model.get('count'));
    };
  }

  Connector.prototype.disconnect = function() {
    this.pagination.off('click:next', this.next);
    this.pagination.off('click:previous', this.previous);
    this.pagination.off('change:number', this.number);
    this.pagination.off('change:size', this.size);

    this.grid.off('change:data', this.data);
  };

  Connector.prototype.connect = function() {
    this.pagination.on('click:next', this.next);
    this.pagination.on('click:previous', this.previous);
    this.pagination.on('change:number', this.number);
    this.pagination.on('change:size', this.size);

    this.grid.on('change:data', this.data);

    return this;
  };

  return Connector;
});