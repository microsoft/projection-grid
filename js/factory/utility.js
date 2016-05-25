import _ from 'underscore';

export function delegateEvents({ from, to, events }) {
  _.each(
    events,
    event => from.on(event, (...args) => to.trigger(event, ...args))
  );
}
