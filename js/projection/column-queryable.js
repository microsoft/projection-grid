define([
      'lib/underscore'
    , 'lib/backbone'
    , 'component/grid/projection/base'
    , 'component/grid/schema/properties'
    , 'component/grid/model/response'
  ],
function(_, Backbone, BaseProjection, schema_properties, Response){
  var Model = BaseProjection.extend({
    defaults : {
        'column.skip'   : 0
      , 'column.take'   : Number.MAX_VALUE
      , 'column.lock'   : []
      , 'column.filter' : function(i) { return true; }
      , 'column.in'     : undefined
    },
    name : 'column-queryable',
    update : function(options){
      if (Model.__super__.update.call(this, options)) {
        var model     = this.src.data
          , take      = this.get('column.take')
          , skip      = this.get('column.skip')
          , lock      = this.get('column.lock') || []
          , filter    = this.get('column.filter')
          // todo [akamel] consider renaming to column.select
          , $in       = this.get('column.in')
          , select    = _.size(model.get('columns'))? _.map(model.get('columns'), function(i){ return i.property; }) : model.get('select')
          , unlocked  = _.isFunction(filter)? _.filter($in || select, filter) : ($in || select)
          , lookup    = {}
          //
          , set       = _.chain(unlocked).difference(lock).value()
          , col       = set
          ;

        // todo [akamel] use indexBy from underscore 1.5.x
        _.each(model.get('columns'), function(element, index, list){
          lookup[element.property] = element;
        });

        if (!_.isNumber(take)) {
          take = Number.MAX_VALUE;
        }

        take = Math.max(take - _.size(lock), 0);
        if (_.size(set) < skip) {
          skip = 0;
          // this.set({ 'columns.skip' : 0 }, { silent : true });
        }

        // start query
        var skipped = _.first(set, skip);

        if (skip) {
          col = _.rest(set, skip);
        }

        var remaining = _.rest(col, take);

        col = _.union(lock, _.first(col, take));
        // end query

        // todo [akamel] [perf] this used a contains within a loop
        var res = _.map(col, function(element, index, list){
          return _.defaults({ $lock : _.contains(lock, element), property : element }, lookup[element]);
        });

        this.patch({
            'columns'           : res
          // todo [akamel] rename to column.in???
          // , 'columns.select'  : set
          , 'columns.skipped'   : skipped
          , 'columns.remaining' : remaining
          // , 'columns.count'   : _.size(res)
          // todo [akamel] do we still need to update skip?
          , 'column.skip'       : skip
        });
      } else {
        // todo [akamel] unset our properties only
        // this.unset();
      }
    }
  });

  return Model;
});