export default class ModelEvent {
  constructor(data) {
    this._id = data.id;
    this._type = {
      iconSrc: `./img/icons/${data[`type`]}.png`,
      id: data.type,
      title: data.type,
    };
    this._city = data.destination.name;
    this._img = data.destination.pictures.map(({src}) => src);
    this._description = data.destination.description;
    this._time = {
      timeStartEvent: data.date_from,
      timeFinishEvent: data[`date_to`],
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

  getEvent() {
    return {
      id: this._id,
      type: this._type,
      city: this._city,
      img: this._img,
      description: this._description,
      time: this._time,
      price: this._price,
      offers: this._offers,
      favorite: this._favorite,
    };

  }
}

