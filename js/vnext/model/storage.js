const defaultPrimaryKey = '__primary_key__';

export class Storage {
  constructor({ primaryKey }) {
    this.primaryKey = primaryKey || defaultPrimaryKey;
  }

  create(attrs) {
    throw new Error('Not implemented');
  }

  read(params) {
    throw new Error('Not implemented');
  }

  update(key, attrs) {
    throw new Error('Not implemented');
  }

  destroy(key) {
    throw new Error('Not implemented');
  }

}

