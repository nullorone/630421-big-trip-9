import ModelEvent from "./model/model-event";

const RESPONSE_STATUS = {
  SUCCESS: 200,
  REDIRECTION: 300
};

const Method = {
  POST: `POST`,
  GET: `GET`,
  DELETE: `DELETE`,
  PUT: `PUT`,
};

const checkStatus = (response) => {
  if (response.status >= RESPONSE_STATUS.SUCCESS && response.status < RESPONSE_STATUS.REDIRECTION) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const throwError = (error) => {
  throw new Error(`fetch error: ${error}`);
};

const toJSON = (response) => {
  return response.json();
};

export default class Api {
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  createEvent(event) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(event.toRAW),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(ModelEvent.parseEvent);
  }

  getPoints() {
    return this._load({url: `points`}).then(toJSON);
  }

  getDestinations() {
    return this._load({url: `destinations`}).then(toJSON);
  }

  getOffers() {
    return this._load({url: `offers`}).then(toJSON);
  }

  deleteEvent({id}) {
    return this._load({
      url: `points/${id}`,
      method: Method.DELETE,
    });
  }

  updateEvent(event) {
    return this._load({
      url: `points/${event.id}`,
      method: Method.PUT,
      body: JSON.stringify(event.toRAW),
      headers: new Headers({'Content-Type': `application/json`})
    }).then(toJSON).then(ModelEvent.parseEvent);
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, `Basic ${this._authorization}`);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch(throwError);
  }
}

