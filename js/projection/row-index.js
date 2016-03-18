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
    name : 'row-index',
    update : function(options){
      if (Model.__super__.update.call(this, options)) {
        var model     = this.src.data
          , skip      = this.get('skip')
          , value     = _.map(model.get('value'), function(i, idx){
                          var ret = _.clone(i);
                          ret.__row_index = idx + (_.isFinite(skip)? skip : 0) + 1;
                          return ret;
                        })
          ;

        this.patch({
            value   : value
        });
      } else {
        // todo [akamel] unset our properties only
        // this.unset();
      }
    }
  });

  return Model;
});