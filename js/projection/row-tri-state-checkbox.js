define([
  'lib/underscore',
  'lib/backbone',
  'component/grid/projection/base',
  'component/grid/layout/template/row.tri-state-checked.jade',
], function (_, Backbone, BaseProjection, defaultRowCheckTemp) {
  'use strict';

  var CheckTransitionRule = {};

  // CheckTransitionRule functions determine the state transition of a checkbox.
  // State transition depends on the current state and wheather a short or full cycle is requested.
  // When the short  cycle is requested the checkbox cannot return to the indeterminate state,
  // event if it started in this state.
  // Two directions of transition are available:
  // ... -> indeterminate -> checked -> unchecked -> ...
  // ... -> indeterminate -> unchecked -> checked -> ...
  CheckTransitionRule.indeterminateToChecked = (function () {
    var nextState = {
      unchecked: function (shortCycle) {
        return shortCycle ? 'checked' : 'indeterminate';
      },
      checked: _.constant('unchecked'),
      indeterminate: _.constant('checked'),
    };

    return function (shortCycle, currentState) {
      return _.has(nextState, currentState) && nextState[currentState](shortCycle) || 'unchecked';
    };
  })();

  CheckTransitionRule.indeterminateToUnchecked = (function () {
    var nextState = {
      unchecked: _.constant('checked'),
      checked: function (shortCycle) {
        return shortCycle ? 'unchecked' : 'indeterminate';
      },
      indeterminate: _.constant('unchecked'),
    };

    return function (shortCycle, currentState) {
      return _.has(nextState, currentState) && nextState[currentState](shortCycle) || 'unchecked';
    };
  })();

  CheckTransitionRule.indeterminateToCheckedFullCycle = function (currentState) {
    return CheckTransitionRule.indeterminateToChecked(false, currentState);
  };

  CheckTransitionRule.indeterminateToUncheckedFullCycle = function (currentState) {
    return CheckTransitionRule.indeterminateToUnchecked(false, currentState);
  };

  CheckTransitionRule.indeterminateToCheckedShortCycle = function (currentState) {
    return CheckTransitionRule.indeterminateToChecked(true, currentState);
  };

  CheckTransitionRule.indeterminateToUncheckedShortCycle = function (currentState) {
    return CheckTransitionRule.indeterminateToUnchecked(true, currentState);
  };

  function getAllCheckState(checkStateCounters, count) {
    return _.findKey(checkStateCounters, function (c) {
      return c === count;
    }) || 'unchecked';
  }

  var Model = BaseProjection.extend({
    defaults: {
      'column.checked': 'checkbox',  // the checkbox column
      'row.check.id': 'Id',
      'row.check.map': {},
      'row.check.all': { state: 'unchecked' },    // used to store user's check value for the special case no rows or all rows is disabled
      'row.check.allow': function () {
        return true;
      },
      'row.check.click-anywhere': false,
      'row.check.transition': CheckTransitionRule.indeterminateToCheckedShortCycle,
      'row.check.all.transition': CheckTransitionRule.indeterminateToCheckedShortCycle,
      'row.check.template': defaultRowCheckTemp,
    },
    name: 'row-check',
    events: {
      'layout:click:cell': 'tdClick',
      'layout:click:header': 'thClick',
    },
    reset: function () {
      this.set({
        'row.check.checked.all': false,
        'row.check.map': {},
      });
    },
    update: function (options) {
      if (!Model.__super__.update.call(this, options)) {
        return;
      }

      var checkId = this.get('row.check.id');
      var ids = _.pluck(this.src.data.get('value'), checkId);
      var checkMap = this.get('row.check.map');
      var col = this.get('column.checked');
      var columns = _.clone(this.src.data.get('columns'));
      var checkStateCounters = _.object(
          ['unchecked', 'checked', 'indeterminate'],
          [0, 0, 0]
        );
      var hasCheckboxable = false;
      var checkboxAllow = this.get('row.check.allow');
      var checkboxColumn = _.find(columns, function (item) {
        return item.property === col;
      });
      var rowCheckTemp = this.get('row.check.template');

      var value = _.map(this.src.data.get('value'), function (item) {
        var ret = _.clone(item);
        var check = checkMap[ret[checkId]] || { state: 'unchecked' };
        var disabled = true;
        var isAllowed = _.isFunction(checkboxAllow) ? checkboxAllow(ret) : checkboxAllow;

        checkStateCounters[check.state]++;

        if (isAllowed) {
          disabled = false;
          hasCheckboxable = true;
        }

        ret[col] = _.extend({}, ret[col], {
          $html: rowCheckTemp({ checkState: check.state, disabled: disabled }),
        });

        return ret;
      });

      // set the checkbox in th
      if (!_.isUndefined(checkboxColumn)) {
        var disabledAllCheck = _.size(ids) === 0;

        if (hasCheckboxable) {
          var checkState = getAllCheckState(checkStateCounters, ids.length);

          checkboxColumn.$html = rowCheckTemp({ checkState: checkState, disabled: disabledAllCheck });
          this.attributes['row.check.all'] = _.extend(this.attributes['row.check.all'], { state: checkState });
        } else {
          checkboxColumn.$html = rowCheckTemp({ checkState: this.get('row.check.all').state, disabled: disabledAllCheck });
        }
      }

      this.patch({
        value: value,
        columns: columns,
      });
    },
    tdClick: function (e, arg) {
      var checkboxProperty = this.get('column.checked');
      var clickAnywhere = this.get('row.check.click-anywhere');

      if (arg.property === checkboxProperty || clickAnywhere) {
        var checkMap = _.clone(this.get('row.check.map'));
        var id = arg.model[this.get('row.check.id')];
        var defaultTransition = this.get('row.check.transition');
        var check = _.extend({id: id, transition: defaultTransition, state: 'unchecked'}, checkMap[id]);

        check.state = check.transition(check.state);
        checkMap[id] = check;

        this.set({
          'row.check.map': checkMap,
        });

        e.stopImmediatePropagation();
      }
    },
    thClick: function (e, arg) {
      var checkboxProperty = this.get('column.checked');

      if (arg.property === checkboxProperty) {
        var checkMap = _.clone(this.get('row.check.map'));
        var checkId = this.get('row.check.id');
        var allCheck = this.get('row.check.all');
        var checkState = allCheck.state;
        var allCheckTransitionRule = this.get('row.check.all.transition');
        var CheckTransitionRule = this.get('row.check.transition');

        allCheck.state = allCheckTransitionRule(checkState);

        checkMap = _.object(
          this.data.get('value')
          .map(function (item) {
            var id = item[checkId];
            var check = _.extend({id: id, transition: CheckTransitionRule}, checkMap[id], {state: allCheck.state});

            return [id, check];
          })
        );

        this.set({
          'row.check.map': checkMap,
          'row.check.all': allCheck,
        });

        e.stopImmediatePropagation();
      }
    },
  });

  function CheckDiff(added, changed, removed, unchanged) {
    this.added = added || {};
    this.changed = changed || {};
    this.removed = removed || {};
    this.unchanged = unchanged || {};
  }

  CheckDiff.prototype.hasChanges = function () {
    return _.keys(this.changed).length + _.keys(this.added).length > 0;
  };

  function diffCheckMap(before, after, defaultState) {
    defaultState = defaultState || { state: 'unchecked' };

    var checkDiff = new CheckDiff();

    _.keys(before).forEach(function (key) {
      var beforeState = before[key];
      var afterState = after[key];

      if (!afterState) {
        checkDiff.removed[key] = beforeState;
      } else if (beforeState.state === afterState.state) {
        checkDiff.unchanged[key] = afterState;
      } else {
        checkDiff.changed[key] = { before: beforeState, after: afterState };
      }
    });

    _.keys(after).forEach(function (key) {
      var afterState = after[key];
      var beforeState = before[key];

      if (!beforeState && defaultState.state !== afterState.state) {
        checkDiff.added[key] = afterState;
      }
    });

    return checkDiff;
  }

  function statCheckMap(checkMap, defaultState) {
    defaultState = defaultState || { state: 'unchecked' };
    var checked = [];
    var indeterminate = [];
    var unchecked = [];

    _.keys(checkMap).forEach(function (key) {
      var check = checkMap[key];

      if (check.state === 'checked' && check.state !== defaultState.state) {
        checked.push(check);
      } else if (check.state === 'unchecked' && check.state !== defaultState.state) {
        unchecked.push(check);
      } else if (check.state !== defaultState.state) {
        indeterminate.push(check);
      }
    });

    return {
      checked: checked,
      unchecked: unchecked,
      indeterminate: indeterminate,
    };
  }

  function fullStatCheckMap(before, after, defaultState) {
    return _.extend(statCheckMap(after, defaultState), diffCheckMap(before, after, defaultState));
  }

  Model.CheckTransitionRule = CheckTransitionRule;
  Model.fullStatCheckMap = fullStatCheckMap;
  Model.statCheckMap = statCheckMap;
  Model.diffCheckMap = diffCheckMap;

  return Model;
});
