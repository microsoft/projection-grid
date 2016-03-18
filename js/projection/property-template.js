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
      'property.template' : {}
    },
    name : 'property-template',
    update : function(options) {
      // Model.__super__.update.call(this, options);

      if (Model.__super__.update.call(this, options)) {
        var model   = this.src.data
          , options = this.get('property.template')
          , value   = _.map(model.get('value'), function(item){
              var ret = _.clone(item);

              _.each(options, function(value, key, list) {
                if (_.has(ret, key)) {
                  var res = value({
                      model     : item
                    , property  : key
                  });

                  if (!_.isObject(ret[key])) {
                    var obj = new Object(ret[key]);

                    if (_.isUndefined(ret[key])) {
                      obj.$undefined = true;
                    }

                    if (_.isNull(ret[key])) {
                      obj.$null = true;
                    }

                    ret[key] = obj;
                  }

                  ret[key].$html = res;
                }
              });

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