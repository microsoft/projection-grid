import _ from 'underscore';

function once(target, event) {
  return new Promise((resolve, reject) => {
    if (!_.isEmpty(target) && _.isFunction(target.once)) {
      target.once(event, () => {
        resolve();
      })
    } else {
      reject(new Error('Target not exist or target no contains "event" function'));
    }
  });
}

export default {
  once,
};
