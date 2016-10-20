import $ from 'jquery';
import _ from 'underscore';

function element(el) {
  return new Promise((resolve, reject) => {
    let $el = el instanceof $ ? el : $(el);
    if ($el.length > 0) {
      resolve($el);
    } else {
      reject(new Error('Element '.concat(el).concat(' not found or not exists')));
    }
  });
}

export default {
  element,
};
