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
        skip        : 0
      , take        : Number.MAX_VALUE
      , filter      : function(){ return true; }
      , orderby     : []
      , select      : []
    },
    name : 'map-queryable',
    beforeSet : function(local, other){
      if (_.has(local, 'filter')) {
        if (!_.isFunction(local['filter'])) {
          local['filter'] = this.defaults['filter'];
        }
      }
    },
    update : function(options){
      // Model.__super__.update.call(this, options);

      if (Model.__super__.update.call(this, options)) {
        var model = this.src.data
          , order =  _.chain(this.get('orderby'))
                      .first()
                      .pairs()
                      .first()
                      .value();

        var order_key = _.first(order)
          , order_dir = _.last(order)
          ;

        var value = model.get('value');
        var count = value? value.length : 0;

        value = _.chain(value)
                  .filter(this.get('filter'))
                  ;

        if (order_key) {
          value = value.sortBy(order_key);
          if (order_dir == -1) {
            value = value.reverse();
          }
        }

        value = value
                  .rest(this.get('skip'))
                  .first(this.get('take'))
                  .value();

        var select = this.get('select');
        if (!_.size(select)) {
          select = schema_properties.from(value);
        }

        this.patch({
            value   : value
          , select  : select
        });
      } else {
        // todo [akamel] unset our properties only
        // this.unset();
      }
    }
  });

  return Model;
});