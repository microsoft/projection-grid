define([
  'lib/underscore',
  'lib/backbone',
  'component/grid/projection/base',
  // 'component/grid/layout/template/row.checked.jade',
  'component/grid/layout/template/selectable.jade',
], function (_, Backbone, BaseProjection, /* rowCheckTemp, */selectableTemplate) {
  'use strict';

  var Model = BaseProjection.extend({
    defaults: {
      'column.checked': 'checkbox',   // the checkbox column
      'row.check.id': 'Id',
      'row.check.list': [],
      'row.check.checked.all': false, // used to store user's check value for the special case no rows or all rows is disabled
      'row.check.single': false,
      'row.check.allow': function () {
        return true;
      },
    },
    name: 'row-check',
    events: {
      'layout:click:cell': 'tdClick',
      'layout:click:header': 'thClick',
    },
    reset: function () {
      this.set({
        'row.check.checked.all': false,
        'row.check.list': [],
      });
    },
    update: function (options) {
      // Model.__super__.update.call(this, options);

      if (Model.__super__.update.call(this, options)) {
        var checkId = this.get('row.check.id');
        var ids = _.pluck(this.src.data.get('value'), checkId);
        var checked = _.intersection(this.get('row.check.list'), ids);
        var checkedLookup = _.object(checked, []);
        var col = this.get('column.checked');
        var columns = _.clone(this.src.data.get('columns'));
        var checkedAll = true;
        var hasCheckboxable = false;
        var checkboxAllow = this.get('row.check.allow');
        var checkboxColumn = _.find(columns, function (item) {
          return item.property === col;
        });
        var isSingle = this.get('row.check.single');

        this.set('row.check.list', checked, { silent: true });

        // todo [akamel] it is not clear how 'hasCheckboxable' is used
        var value = _.map(this.src.data.get('value'), function (item) {
          var ret = _.clone(item);
          var checked = false;
          var disabled = true;
          var isAllowed = _.isFunction(checkboxAllow) ? checkboxAllow(ret) : checkboxAllow;

          if (isAllowed) {
            checked = _.has(checkedLookup, ret[checkId]);
            checkedAll = checkedAll && checked;
            disabled = false;
            hasCheckboxable = true;

            ret[col] = _.extend({}, ret[col], {
              $html: selectableTemplate({
                type: isSingle ? 'radio' : 'checkbox',
                checked: checked,
                disabled: disabled,
              }),
            });
          }

          return ret;
        });

        // set the checkbox in th
        if (!_.isUndefined(checkboxColumn)) {
          if (isSingle) {
            checkboxColumn.$html = '<span/>';
          } else {
            var disabled = _.size(ids) === 0;
            if (hasCheckboxable) {
              checkboxColumn.$html = selectableTemplate({
                type: 'checkbox',
                checked: checkedAll,
                disabled: disabled,
              });
              this.attributes['row.check.checked.all'] = checkedAll;
            } else {
              checkboxColumn.$html = selectableTemplate({
                type: 'checkbox',
                checked: this.get('row.check.checked.all'),
                disabled: disabled,
              });
            }
          }
        }

        this.patch({
          value: value,
          columns: columns,
        });
      } else {
        // todo [akamel] unset our properties only
        // this.unset();
      }
    },
    tdClick: function (e, arg) {
      var checkboxProperty = this.get('column.checked');
      var isSingle = this.get('row.check.single');

      if (arg.property === checkboxProperty) {
        var list = this.get('row.check.list');
        var id = arg.model[this.get('row.check.id')];

        if (isSingle) {
          this.set({ 'row.check.list': [id] });
        } else {
          this.set({
            'row.check.list': arg.checked ? list.concat([id]) : _.without(list, id),
          });
        }

        this.update();
      }
    },
    thClick: function (e, arg) {
      var checkboxProperty = this.get('column.checked');

      if (arg.property === checkboxProperty) {
        var list = [];

        if (arg.checked) {
          var checkId = this.get('row.check.id');
          // TODO [akamel] this concept of check allow is strange
          var checkboxAllow = this.get('row.check.allow');

          // get the list of allowed rows' id
          list = _.chain(this.data.get('value'))
            .filter(function (item) {
              return (_.isFunction(checkboxAllow) ? checkboxAllow(item) : checkboxAllow) && !_.isUndefined(item[checkId]);
            })
            .map(function (item) {
              return item[checkId];
            })
            .value();
        }

        this.set({
          'row.check.list': list,
          'row.check.checked.all': arg.checked,
        });

        this.update();
      }
    },
  });

  return Model;
});
