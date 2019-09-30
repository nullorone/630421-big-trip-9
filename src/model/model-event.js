import moment from "moment";

export default class ModelEvent {
  constructor(data) {
    this._id = data.id;
    this._type = {
      iconSrc: `./img/icons/${data[`type`]}.png`,
      id: data.type,
      title: data.type,
    };
    this._city = data.destination.name;
    this._images = data.destination.pictures;
    this._description = data.destination.description;
    this._time = {
      timeStartEvent: moment(data.date_from),
      timeFinishEvent: moment(data.date_to),
    };
    this._price = data[`base_price`];
    this._offers = new Set(data.offers);
    this._favorite = data.is_favorite;
  }

  static parseEvent(data) {
    return new ModelEvent(data).getEvent();
  }

  static parseEvents(data) {
    return data.map(ModelEvent.parseEvent);
  }

  toRAW() {
    return {
      'id': this._id,
      'base_price': this._price,
      'date_from': this._time.timeStartEvent,
      'date_to': this._time.timeFinishEvent,
      'destination': {
        'description': this._description,
        'name': this._city,
        'pictures': this._images,
      },
      'is_favorite': this._favorite,
      'offers': [...this._offers]
    };
  }

  getEvent() {
    return {
      id: this._id,
      type: this._type,
      city: this._city,
      images: this._images,
      description: this._description,
      time: this._time,
      price: this._price,
      offers: this._offers,
      favorite: this._favorite,
    };

  }
}

