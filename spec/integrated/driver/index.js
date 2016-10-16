import _ from 'underscore';
import protocol from './protocol';
import action from './action';

let exports = _.extend({}, protocol, action);

exports.context = (element, cb) => {
  protocal.element(element, (err, $el) => {
    cb(null, _.extend($el, exports));
  });
  return this;
};

export default exports;