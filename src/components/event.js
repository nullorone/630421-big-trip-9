// Разметка карточки путешествия
import Abstract from "./abstract";
import {getDurationTime} from "../utils/util";

export default class Event extends Abstract {
  constructor({
    type: {iconSrc, title},
    price,
    city,
    offers,
    time: {
      timeStartEvent,
      timeFinishEvent,
    }}) {
    super();
    this._iconSrc = iconSrc;
    this._title = title;
    this._price = price;
    this._city = city;
    this._offers = offers;
    this._timeStartEvent = timeStartEvent;
    this._timeFinishEvent = timeFinishEvent;
    this._days = getDurationTime(this._timeStartEvent, this._timeFinishEvent).days;
    this._hours = getDurationTime(this._timeStartEvent, this._timeFinishEvent).hours;
    this._minutes = getDurationTime(this._timeStartEvent, this._timeFinishEvent).minutes;
    this._timeStartEventFormat = this.getFormattingTime(this._timeStartEvent);
    this._timeStartEventIsoFormat = this.getFormattingIsoTime(this._timeStartEvent);
    this._timeFinishEventFormat = this.getFormattingTime(this._timeFinishEvent);
    this._timeFinishEventIsoFormat = this.getFormattingIsoTime(this._timeFinishEvent);
  }

  getFormattingIsoTime(time) {
    return new Date(time).toISOString().substr(0, 16);
  }

  getFormattingTime(time) {
    return new Date(time).toTimeString().substr(0, 5);
  }

  getEventOffers() {
    return [...this._offers].map(({title: offerTitle, price: offerPrice}) => `
             <li class="event__offer">
              <span class="event__offer-title">${offerTitle}</span>
              &plus;
              &euro;&nbsp;<span class="event__offer-price">${offerPrice}</span>
             </li>`.trim()).join(``);
  }

  getTemplate() {
    return `
      <li class="trip-events__item">
        <div class="event">
          <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="${this._iconSrc}" alt="Event type icon">
          </div>
          <h3 class="event__title">${this._title} ${this._city}</h3>

          <div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time" datetime="${this._timeStartEventIsoFormat}">${this._timeStartEventFormat}</time>
              &mdash;
              <time class="event__end-time" datetime="${this._timeFinishEventIsoFormat}">${this._timeFinishEventFormat}</time>
            </p>
            <p class="event__duration">${this._days} ${this._hours} ${this._minutes}</p>
          </div>

          <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${this._price}</span>
          </p>

          <h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">
          ${this.getEventOffers()}
          </ul>

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </div>
      </li>`.trim();
  }
}
