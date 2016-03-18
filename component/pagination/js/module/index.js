define([
      'lib/underscore'
    , 'lib/jquery'
    , 'lib/backbone'
    , 'lib/knockout'
    , 'component/state/index'
    , 'component/pagination/layout/simple'
    , 'component/pagination/viewmodel/index'
  ],
function(_, $, Backbone, ko, state, tmpl, KoModel){
  'use strict';

  var Pagination = Backbone.View.extend({
    initialize: function(options) {
      _.bindAll(this, 'p_click', 'n_click');

      this.options = _.defaults(options || {}, {
        page_size : state.get('gridPageSize') || 20,
        template : tmpl
      });

      this.ko_model = new KoModel(this.options);
    },

    events: {
      'click .previous'           : 'p_click',
      'click .next'               : 'n_click',
      'change .pagination-size'   : 'sizeChanged',
      'change .pagination-number' : 'numberChanged'
    },

    sizeChanged : function(e){
      this.trigger('change:size', e, {
          page_size : this.ko_model.page_size()
      });
    },

    numberChanged : function(e){
      this.trigger('change:number', e, {
          page_number : this.ko_model.page_number()
      });
    },

    p_click : function(e){
      var isDisabled = $(e.currentTarget).hasClass('disabled');

      if (!isDisabled) {
        this.trigger('click:previous', e, {
            page_number : this.ko_model.page_number()
        });
      }
    },

    n_click: function(e){
      var disabled = $(e.currentTarget).hasClass('disabled');

      if (!disabled) {
        this.trigger('click:next', e, {
            page_number : this.ko_model.page_number()
        });
      }
    },

    page : function(num){
      this.ko_model.page_number(num);
    },

    // todo [akamel] clean node [ko] upon remove
    render: function() {
      this.el.innerHTML = this.options.template({i18n: this.options.i18n});

      ko.applyBindings(this.ko_model, this.el);

      return this;
    }
  });

  return Pagination;
});