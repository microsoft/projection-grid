define([
      'lib/underscore'
    , 'lib/backbone'
    , 'component/grid/projection/base'
    , 'component/grid/layout/template/row.checked'
  ],
function(_, Backbone, BaseProjection, rowCheckTemp){
  'use strict';

  var Model = BaseProjection.extend({
    defaults : {
        'column.checked'          : 'checkbox'  //the checkbox column
      , 'row.check.id'            : 'Id'
      , 'row.check.list'          : []
      , 'row.check.checked.all'   : false   //used to store user's check value for the special case no rows or all rows is disabled
      , 'row.check.allow'         : function() { return true; }
    },
    name : 'row-check',
    events : {
        'layout:click:cell'       : 'td_click'
      , 'layout:click:header'     : 'th_click'
    },
    reset : function() {
      this.set({
        'row.check.checked.all' : false,
        'row.check.list'        : []
      });
    },
    update : function(options){
      // Model.__super__.update.call(this, options);

      if (Model.__super__.update.call(this, options)) {
        var check_id         = this.get('row.check.id')
          , ids              = _.pluck(this.src.data.get('value'), check_id)
          , checked          = _.intersection(this.get('row.check.list'), ids)
          , checked_lookup   = _.object(checked, [])
          , col              = this.get('column.checked')
          , columns          = _.clone(this.src.data.get('columns'))
          , checkedAll       = true
          , has_checkboxable = false
          , checkbox_allow   = this.get('row.check.allow')
          , checkbox_column  = _.find(columns, function(item){ return item['property'] === col; })
          ;

        this.set('row.check.list', checked, { silent : true });

        // todo [akamel] it is not clear how 'has_checkboxable' is used
        var value = _.map(this.src.data.get('value'), function(item) {
            var ret       = _.clone(item);
            var checked   = false;
            var disabled  = true;
            var isAllowed = _.isFunction(checkbox_allow) ? checkbox_allow(ret) : checkbox_allow;

            if (isAllowed) {
              checked          = _.has(checked_lookup, ret[check_id]);
              checkedAll       = checkedAll && checked;
              disabled         = false;
              has_checkboxable = true;
            }

            ret[col] = _.extend({}, ret[col], {
                $html : rowCheckTemp({ checked : checked, disabled : disabled })
            })

            return ret;
          })
        ;

        //set the checkbox in th
        if (!_.isUndefined(checkbox_column)) {
          var disabled = _.size(ids) === 0;
          if (has_checkboxable) {
            checkbox_column.$html = rowCheckTemp({ checked : checkedAll, disabled : disabled });
            this.attributes['row.check.checked.all'] = checkedAll;
          } else {
            checkbox_column.$html = rowCheckTemp({ checked : this.get('row.check.checked.all'), disabled : disabled });
          }
        }

        this.patch({
            value   : value
          , columns : columns
        });
      } else {
        // todo [akamel] unset our properties only
        // this.unset();
      }
    },
    td_click : function(e, arg) {
      var checkbox_property = this.get('column.checked');

      if (arg.property === checkbox_property) {
        var list  = this.get('row.check.list')
          , id    = arg.model[this.get('row.check.id')]
          ;

        this.set({
            'row.check.list' : arg.checked? list.concat([id]) : _.without(list, id)
        });

        this.update();
      }
    },
    th_click : function(e, arg) {
      var checkbox_property = this.get('column.checked');

      if (arg.property === checkbox_property) {
        var list = [];

        if (arg.checked) {
          var check_id        = this.get('row.check.id')
            // todo [akamel] this concept of check allow is strange
            , checkbox_allow  = this.get('row.check.allow')
            ;

          //get the list of allowed rows' id
          list = _.chain(this.data.get('value'))
                  .filter(function(item){
                    return !!(_.isFunction(checkbox_allow) ? checkbox_allow(item) : checkbox_allow) && !_.isUndefined(item[check_id]);
                  })
                  .map(function(item){
                    return item[check_id];
                  })
                  .value();
        }

        this.set({
            'row.check.list'        : list
          , 'row.check.checked.all' : arg.checked
        });

        this.update();
      }
    }
  });

  return Model;
});