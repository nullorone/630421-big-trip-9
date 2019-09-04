import Abstract from "./abstract";

export default class AbstractEvent extends Abstract {
  constructor({
    type: {iconName, title},
    price,
    city,
    img,
    offers,
    time: {
      timeStartEvent,
      timeFinishEvent,
      duration: {
        days,
        hours,
        minutes,
      }
    },
    description,}) {
    super();
    this._iconName = iconName;
    this._title = title;
    this._price = price;
    this._city = city;
    this._img = img;
    this._offers = offers;
    this._description = description;
    this._timeStartEvent = timeStartEvent;
    this._timeFinishEvent = timeFinishEvent;
    this._days = days;
    this._hours = hours;
    this._minutes = minutes;
  }
}

