export default class Store {
  constructor({keyStorage, storage}) {
    this._keyStorage = keyStorage;
    this._storage = storage;
  }

  setItem({key, item}) {
    const items = this.getAll();
    items[key] = item;

    this._storage.setItem(this._keyStorage, JSON.stringify(items));
  }

  removeItem({key}) {
    const items = this.getAll();
    delete items[key];

    this._storage.setItem(this._keyStorage, JSON.stringify(items));
  }

  getItem({key}) {
    const items = this.getAll();
    return items[key];
  }

  getAll() {
    const emptyItem = {};
    const items = this._storage.getItem(this._keyStorage);

    if (!items) {
      return emptyItem;
    }

    try {
      return JSON.parse(items);
    } catch (e) {
      return emptyItem;
    }
  }
}

