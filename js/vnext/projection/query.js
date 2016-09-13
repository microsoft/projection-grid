export function query(state, options) {
  const dataSource = gridView.get('dataSource');
  const read = dataSource.read;
  return read(options);
}

