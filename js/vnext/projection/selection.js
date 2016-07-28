import _ from 'underscore';

export function selection (state, { selection } = {}) {
  if (!selection) {
    return state;
  }

  state.columns.unshift({ name: 'selection', width: '15px' });

  return state;
}
