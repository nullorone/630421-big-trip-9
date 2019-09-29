const Method = {
  POST: `POST`,
  GET: `GET`,
  DELETE: `DELETE`,
  PUT: `PUT`,
  PATCH: `PATCH`,
  HEAD: `HEAD`,
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
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

  getResult(result) {
    return result;
  }

  createEvent({event}) {
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

  updateEvent({id, data}) {
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, `Basic ${this._authorization}`);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch(throwError);
  }
}

