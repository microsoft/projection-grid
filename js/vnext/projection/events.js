import _ from 'underscore';

function sequence(...args) {
  const callbacks = _.filter(args, _.isFunction);
  return function (...argsInner) {
    _.each(callbacks, cb => cb.apply(this, argsInner));
  };
}

/**
* Binding both 'state.events' and 'eventsOptions' to grid element
*
* @param {Object} state
* @param {Object} [state.events]
* @param {Object} eventsOptions 
*
*/
export const events = {
  name: 'events',
  handler(state, eventsOptions) {
    const pairs = _.pairs(state.events).concat(_.pairs(eventsOptions));
    const events = _.reduce(pairs, (memo, [key, handler]) => {
      return _.extend(memo, {
        [key]: sequence(memo[key], handler)
      });
    }, {});

    return _.defaults({ events }, state);
  },
  defaults: {},
};

