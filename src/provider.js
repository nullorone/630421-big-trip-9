import {transformObjectToArray} from "./utils/util";
import ModelEvent from "./model/model-event";

export default class Provider {
  constructor({api, store}) {
    this._api = api;
    this._store = store;
  }

  createEvent(event) {
    return this._api
      .createEvent(event)
      .then((createdEvent) => {
        this._saveEvent(createdEvent);
        return createdEvent;
      });
  }

  getPoints() {
    if (this._isOnline()) {
      return this._api
        .getPoints()
        .then((events) => {
          events.forEach((event) => this._saveEvent(event));
          return events;
        });
    } else {
      const rawEventsMap = this._store.getAll();
      const rawEvents = transformObjectToArray(rawEventsMap);
      const events = ModelEvent.parseEvents(rawEvents);

      return Promise.resolve(events);
    }

  }

  deleteEvent({id}) {
    if (this._isOnline()) {
      return this._api
        .deleteEvent({id})
        .then(() => {
          this._store.removeItem({key: id});
        });
    } else {
      this._store.removeItem({key: id});
      return Promise.resolve(true);
    }
  }

  updateEvent(event) {
    if (this._isOnline()) {
      return this._api
        .updateEvent(event)
        .then((updatedEvent) => {
          this._saveEvent(updatedEvent);
          return updatedEvent;
        });
    } else {
      const unsavedEvent = event;
      this._store.setItem({key: unsavedEvent.id, item: unsavedEvent});
      return Promise.resolve(ModelEvent.parseEvent(unsavedEvent));
    }
  }

  syncPoints() {
    return this._api.syncPoints({events: transformObjectToArray(this._store.getAll())});
  }

  getOffers() {
    return this._api.getOffers();
  }

  _saveEvent(event) {
    this._store.setItem({key: event.id, item: event});
  }

  _isOnline() {
    return window.navigator.onLine;
  }

}

