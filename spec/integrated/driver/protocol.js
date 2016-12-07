import Promise from 'bluebird';
import $ from 'jquery';

function element(el) {
  return new Promise((resolve, reject) => {
    let $el = el instanceof $ ? el : $(el);
    resolve($el);
  });
}

export default {
  element,
};
