import $ from 'jquery';
import _ from 'underscore';

function element(selector, cb) {
  let find = _.isFunction(this.find) ? this.find.bind(this) : $;
  let $element = _.isString(selector) ? find(selector) : selector;
  cb = _.isFunction(cb) ? cb : () => {};
  if($element.length > 0) {
    cb(null, $element);
  }
  else {
    cb(new Error('Element '.concat(selector).concat(' not found or not currently visible')));
  }
  return this;
}

export default {
  element,
};
