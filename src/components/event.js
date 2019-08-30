// Разметка карточки путешествия
import {createElement} from "../utils/util";

export default class Event {
  constructor({
    type: {iconName, title},
    price,
    offers,
    time: {
      timeStartEvent,
      timeFinishEvent,
      duration: {
        days,
        hours,
        minutes,
      }
    }}) {
    this._iconName = iconName;
    this._title = title;
    this._price = price;
    this._offers = offers;
    this._timeStartEvent = timeStartEvent;
    this._timeFinishEvent = timeFinishEvent;
    this._days = days;
    this._hours = hours;
    this._minutes = minutes;
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  getTemplate() {
    return `
      <li class="trip-events__item">
        <div class="event">
          <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${this._iconName}.png" alt="Event type icon">
          </div>
          <h3 class="event__title">${this._title} airport</h3>

          <div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time" datetime="${new Date(this._timeStartEvent).toISOString().substr(0, 16)}">${new Date(this._timeStartEvent).toTimeString().substr(0, 5)}</time>
              &mdash;
              <time class="event__end-time" datetime="${new Date(this._timeFinishEvent).toISOString().substr(0, 16)}">${new Date(this._timeFinishEvent).toTimeString().substr(0, 5)}</time>
            </p>
            <p class="event__duration">${this._days} ${this._hours} ${this._minutes}</p>
          </div>

          <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${this._price}</span>
          </p>

          <h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">
          ${[...this._offers].map(({title: offerTitle, price: offerPrice}) => `
             <li class="event__offer">
              <span class="event__offer-title">${offerTitle}</span>
              &plus;
              &euro;&nbsp;<span class="event__offer-price">${offerPrice}</span>
             </li>
             `).join(``)}
          </ul>

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </div>
      </li>`.trim();
  }
}
