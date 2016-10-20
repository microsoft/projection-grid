import $ from 'jquery';
import _ from 'underscore';
import protocol from './protocol';

function click(selector) {
  return new Promise((resolve, reject) => {
    protocol.element.call(this, selector)
      .then(($el) => {
        $el.click();
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function setValue(selector, value) {
  return new Promise((resolve, reject) => {
    protocol.element.call(this, selector)
      .then(($el) => {
        $el.val(value).change();
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export default {
  click,
  setValue,
};
