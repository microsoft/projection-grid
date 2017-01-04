import Promise from 'bluebird';
import _ from 'underscore';
import protocol from './protocol';

function pause(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

function scroll(selector, xoffset, yoffset) {
  return new Promise((resolve, reject) => {
    if (!_.isString(selector)) {
      yoffset = xoffset;
      xoffset = selector;
      selector = undefined;
    } else if (arguments.length < 3) {
      xoffset = 0;
      yoffset = 0;
    }
  
    if (!(_.isUndefined(selector) || _.isString(selector)) && _.isNumber(xoffset) && _.isNumber(yoffset)) {
      reject(new Error('Input is invalid.'));
    }

    if (selector) {
      protocol.element.call(this, selector)
        .then(($el) => {
          let elOffset = $el.offset();
          let rectLeft = elOffset.left + xoffset;
          let rectTop = elOffset.top + yoffset;

          window.scrollTo(rectLeft, rectTop);
          resolve();
        })
        .catch(reject);
    } else {
      window.scrollTo(xoffset, yoffset);
      resolve();
    }
  });
}

export default {
  pause,
  scroll,
};
