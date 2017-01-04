import _ from 'underscore';

function sequence(...args) {
  const callbacks = _.filter(args, _.isFunction);
  return function (...argsInner) {
    _.each(callbacks, cb => cb.apply(this, argsInner));
  };
}

/**
 * @external BackboneViewEventHash
 * @see {@link http://backbonejs.org/#View-events}
 */

/**
 * Merge the customized events with the projection injected events.
 * @param {ContentChainState} state
 *    The input state.
 * @param {external:BackboneViewEventHash} eventsOptions 
 *    The customized events in form of `Backbone.View#events`.
 */
function eventsProjectionHandler(state, eventsOptions) {
  const pairs = _.pairs(state.events).concat(_.pairs(eventsOptions));
  const events = _.reduce(pairs, (memo, [key, handler]) => {
    return _.extend(memo, {
      [key]: sequence(memo[key], handler)
    });
  }, {});

  return _.defaults({ events }, state);
}

export const events = {
  name: 'events',
  handler: eventsProjectionHandler,
  defaults: {},
};

