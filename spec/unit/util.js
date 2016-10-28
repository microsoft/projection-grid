import { flow, omit, isEqual } from 'lodash/fp';
import sinon from 'sinon';
import $ from 'lib/jquery';

export var $container = $('body > #container');
if ($container.length === 0) {
  $container = $('<div id="container" />').appendTo('body');
}

export function cleanup() {
  $container.empty();
}

export function objectPartialMatch(propsToOmit, expected) {
  const omitProps = omit(propsToOmit);
  return sinon.match(
    flow(
      // function (actual) {
      //   console.log('Actual', JSON.stringify(omitProps(actual)));
      //   console.log('Expected', JSON.stringify(expected));
      //   return actual;
      // },
      omitProps,
      isEqual(expected)
      // result => {
      //   console.log('result', result);
      //   return result;
      // }
    ), 'matching ' + JSON.stringify(expected) + ' without [' + propsToOmit.map(prop => `"${prop}"`).join(', ') + '] properties');
}
