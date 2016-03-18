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
      // todo [akamel] consider supporting a select on this level?
      map : function(i) { return i; }
    },
    name : 'map',
    update : function(options){
      // Model.__super__.update.call(this, options);

      if (Model.__super__.update.call(this, options)) {
        var model     = this.src.data
          , map       = this.get('map')
          , value     = _.isFunction(map)? _.map(model.get('value'), map) : model.get('value')
          ;

        value = _.flatten(value);

        this.patch({
            value   : value
          , select  : schema_properties.from(value)
        });
      } else {
        // todo [akamel] unset our properties only
        // this.unset();
      }
    }
  });

  return Model;
});
