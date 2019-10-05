import DOMPurify from 'dompurify';

export default class ModelEvent {
  constructor(data) {
    this._id = DOMPurify.sanitize(data.id);
    this._type = {
      iconSrc: `./img/icons/${data[`type`]}.png`,
      id: DOMPurify.sanitize(data.type),
      title: DOMPurify.sanitize(data.type),
    };
    this._city = DOMPurify.sanitize(data.destination.name);
    this._images = data.destination.pictures;
    this._description = DOMPurify.sanitize(data.destination.description);
    this._time = {
      timeStartEvent: data.date_from,
      timeFinishEvent: data.date_to,
    };
    this._price = DOMPurify.sanitize(data[`base_price`]);
    this._offers = new Set(data.offers);
    this._favorite = DOMPurify.sanitize(data.is_favorite);
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

