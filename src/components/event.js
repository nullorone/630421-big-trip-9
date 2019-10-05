// Разметка карточки путешествия
import Abstract from "./abstract";
import {getDurationTime, transformTypeEvent} from "../utils/util";
import moment from "moment";

export default class Event extends Abstract {
  constructor(mockEvent) {
    super();
    this._iconSrc = mockEvent.type.iconSrc;
    this._title = mockEvent.type.title;
    this._price = mockEvent.price;
    this._city = mockEvent.city;
    this._offers = mockEvent.offers;
    this._timeStartEvent = mockEvent.time.timeStartEvent;
    this._timeFinishEvent = mockEvent.time.timeFinishEvent;
    this._days = getDurationTime(this._timeStartEvent, this._timeFinishEvent).days;
    this._hours = getDurationTime(this._timeStartEvent, this._timeFinishEvent).hours;
    this._minutes = getDurationTime(this._timeStartEvent, this._timeFinishEvent).minutes;
  }

  getEventOffers() {
    return [...this._offers].slice(0, 3).map(({title: offerTitle, price: offerPrice, accepted}) => {
      return accepted ? `<li class="event__offer">
              <span class="event__offer-title">${offerTitle}</span>
              &plus;
              &euro;&nbsp;<span class="event__offer-price">${offerPrice}</span>
             </li>`.trim() : ``;
    }).join(``);
  }

  getTemplate() {
    return `
      <li class="trip-events__item">
        <div class="event">
          <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="${this._iconSrc}" alt="Event type icon">
          </div>
          <h3 class="event__title">${transformTypeEvent(this._title)} ${this._city}</h3>

          <div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time" datetime="${moment(this._timeStartEvent).format().slice(0, -9)}">${moment(this._timeStartEvent).format(`H:mm`)}</time>
              &mdash;
              <time class="event__end-time" datetime="${moment(this._timeFinishEvent).format().slice(0, -9)}">${moment(this._timeFinishEvent).format(`H:mm`)}</time>
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
