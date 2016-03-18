define([], function() {
  function Connector(dataSource, pagination) {
    this.dataSource = dataSource;
    this.pagination = pagination;

    function setPageNumber(newValue) {
      if (newValue && newValue !== dataSource.page()) {
        dataSource.page(newValue);
      }
    }

    this.next = function(e, arg) {
      var newValue = arg.page_number + 2;
      setPageNumber(newValue);
      pagination.ko_model.page_number(arg.page_number + 1);
    };

    this.previous = function(e, arg) {
      var newValue = arg.page_number;
      setPageNumber(newValue);
      pagination.ko_model.page_number(arg.page_number - 1);
    };

    this.number = function(e, arg) {
      var newValue = arg.page_number + 1;
      setPageNumber(newValue);
      pagination.ko_model.page_number(arg.page_number);
    };

    this.change = function() {
      pagination.ko_model.item_count(dataSource.total());
      pagination.ko_model.page_size(dataSource.pageSize());
    };

    this.size = function(e, arg) {
      pagination.ko_model.page_size(arg.page_size);
      pagination.ko_model.page_number(0);
    };
  }

  Connector.prototype.disconnect = function() {
    this.pagination.off('click:next', this.next);
    this.pagination.off('click:previous', this.previous);
    this.pagination.off('change:number', this.number);
    this.pagination.off('change:size', this.size);

    this.dataSource.unbind('change', this.change);
  };

  Connector.prototype.connect = function() {
    this.pagination.on('click:next', this.next);
    this.pagination.on('click:previous', this.previous);
    this.pagination.on('change:number', this.number);
    this.pagination.on('change:size', this.size);

    this.dataSource.bind('change', this.change);

    return this;
  };

  return Connector;
});