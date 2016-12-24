import _ from 'underscore';

function a11yProjectionHandler(state, a11y) {
  let selectAllLabel = (a11y && a11y.selectAllLabel) ? a11y.selectAllLabel : 'Select All';
  const patch = {
    a11y: {
      selectAllLabel,
    }
  }

  return _.defaults(patch, state);
}

export const a11y = {
  name: 'a11y',
  handler: a11yProjectionHandler,
  default: null
}
