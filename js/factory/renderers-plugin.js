import layout from '../layout/index';

export default definePlugin => definePlugin('renderers', [
  'config',
], function (config) {
  const renderers = [];

  if (config.scrollable) {
    if (config.scrollable.virtual) {
      renderers.push(layout.renderers.Virtualization);
    }
    if (config.scrollable.fixedHeader) {
      renderers.push(layout.renderers.FixedHeader);
    }
  }

  return renderers;
});
