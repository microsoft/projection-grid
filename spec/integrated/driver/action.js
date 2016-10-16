import $ from 'jquery';
import _ from 'underscore';
import protocol from './protocol';

function click(selector, cb) {
  protocol.element.call(this, selector, (err, $el) => {
    if (err) {
      if (_.isFunction(cb)) {
        cb(err);
      }
    } else {
      $el.click();
      if (_.isFunction(cb)) {
        cb();
      }
    }
  });
  return this;
}

export default {
  click,
};
