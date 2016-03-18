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
    },
    name : 'column-shifter',
    events : {
        'layout:click:header'     : 'th_click'
    },
    update : function(options) {
      // todo [akamel] when calling a deep update; suppress onchange event based updates
      if (Model.__super__.update.call(this, options)) {
        var model         = this.src.data
          // todo [akamel] have 'columns' crated at the source so we don't have to put this all over the place
          , columns       = model.get('columns') || _.map(model.get('select'), function(i){ return { property : i }; })
          , col_skipped   = model.get('columns.skipped')
          , col_remaining = model.get('columns.remaining')
          ;

        var unlocked_at = Math.max(_.findIndex(columns, function(col) { return !col.$lock; }), 0);

        var has_less = !!_.size(col_skipped)
          , has_more = !!_.size(col_remaining)
          ;

        var col_less = { 
              property  : 'column.skip.less'
            , $metadata : { 'attr.head' : { 'class' : ['skip-less'] }, enabled : has_less }
            , $html     : '<span class="glyphicon glyphicon-triangle-left" />'
          }
          , col_more = {
            property    : 'column.skip.more'
            , $metadata : { 'attr.head' : { 'class' : ['skip-more'] }, enabled : has_more }
            , $html     : '<span class="glyphicon glyphicon-triangle-right" />'
          };

        if (!has_less) {
          col_less.$metadata['attr.head']['class'].push('disabled');
        }

        if (!has_more) {
          col_more.$metadata['attr.head']['class'].push('disabled');
        }

        columns.splice(unlocked_at, 0, col_less);
        columns.push(col_more);

        this.patch({
          'columns'     : columns
        });
      } else {
        // todo [akamel] unset our properties only
        // this.unset();
      }
    },
    th_click : function(e, arg) {
      if (_.has(arg.column, '$metadata') && arg.column.$metadata.enabled) {
        var ret   = 0
          , skip  = this.get('column.skip')
          ;

        // todo [akamel] is this logic solid?
        switch(arg.property) {
          case 'column.skip.less':
          ret = _.isNumber(skip)? Math.max(skip - 1, 0) : 0;
          break;
          case 'column.skip.more':
          ret = _.isNumber(skip)? skip + 1 : 0;
          break;
        }


        this.set({ 'column.skip' : ret });
      }
    }
  });

  return Model;
});