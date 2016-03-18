define([
      'lib/underscore'
    , 'lib/knockout'
    , '$/i18n!component/pagination'
  ],
function(_, ko, i18n){
  'use strict';

  // todo [akamel] prevent from setting page number that is more than item_count
  var Model = function(model){
    model = model || {};
    var page_number = _.isNumber(model.page_number) ? model.page_number : 0
      , page_size   = _.isNumber(model.page_size)   ? model.page_size   : 0
      , item_count  = _.isNumber(model.item_count)  ? model.item_count  : 0
      ;

    /************************************************
    // All numbers / calculations in this model are 
    // base 0; so page 0 is the first page
    *************************************************/
    this.page_size_collection = model.page_size_collection || [20, 50, 100, 200];
    this.page_number        = ko.observable(page_number);
    this.page_size          = ko.observable(page_size);
    this.item_count         = ko.observable(item_count);

    this.page_count         = ko.computed(function(){
      return Math.ceil(this.item_count() / this.page_size());
    }.bind(this));

    this.skip               = ko.computed(function(){
      return this.page_number() * this.page_size();
    }.bind(this));

    this.take               = ko.computed(function(){
      return this.page_size();
    }.bind(this));

    this.item_from          = ko.computed(function(){
      return this.skip() + 1;
    }.bind(this));

    this.item_to            = ko.computed(function(){
      var skip  = this.skip()
        , take  = this.take()
        , rem   = this.item_count() - skip
        ;

      return skip + Math.min(take, rem);
    }.bind(this));

    this.page_count_before  = ko.computed(function(){
      return this.page_number();
    }.bind(this));

    this.page_count_after   = ko.computed(function(){
      var take  = this.take()
        , left  = this.item_count() - this.skip() - take
        ;

      if (left === 0) {
        return 0;
      }

      var pages   = Math.floor(left / take)
        , rem     = left % take
        ;

      return rem? pages + 1 : pages;
    }.bind(this));

    this.input_page_number  = ko.computed({
      read  : function() {
        return this.page_number() + 1;
      },
      write : function(value) {
        var number = Number(value);
        if (!_.isNaN(number)) {          
          if (number > 0 && number <= this.page_count()) {
            this.page_number(number - 1);
          }
        }
      },
      owner : this
    });

    this.human_item_range   = ko.computed(function(){
      var from    = this.item_from()
        , to      = this.item_to()
        , total   = this.item_count()
        ;

      return i18n.get('Component_Pagination_SummaryText', {
          from  : from
        , to    : to
        , total : total
      });
    }.bind(this));
  };

  return Model;
});
