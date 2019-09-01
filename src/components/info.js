import {createElement} from "../utils/util";

export default class Info {
  constructor(events) {
    this._events = events;
    this._element = null;
    this._cities = this.getCitiesEvents();
    this._timeStartEvent = this.formattingTimeStartFirstEvent;
    this._timeFinishEvent = this.formattingTimeFinishLastEvent;
    this._separatorCities = ` \u2014 `;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  getCitiesEvents() {
    return this._events.map(({city}) => city);
  }

  getInfoTitle() {
    if (this._cities.length > 3) {
      return `<h1 class="trip-info__title">${this._cities[0]} &mdash; ... &mdash; ${this._cities[this._cities.length - 1]}</h1>`;
    } else if (this._cities.length === 1) {
      return `<h1 class="trip-info__title">${this._cities}${this._separatorCities}${this._cities}</h1>`;
    } else {
      return `<h1 class="trip-info__title">${this._cities.join(this._separatorCities)}</h1>`;
    }
  }

  get formattingTimeStartFirstEvent() {
    const {time: {timeStartEvent}} = this._events[0];
    return new Date(timeStartEvent).toDateString().substr(4, 6);
  }

  get formattingTimeFinishLastEvent() {
    const {time: {timeFinishEvent}} = this._events[this._events.length - 1];
    return new Date(timeFinishEvent).toDateString().substr(4, 6);
  }

  getTemplate() {
    return `
      <div class="trip-info__main">
        ${this.getInfoTitle()}
          <p class="trip-info__dates">${this._timeStartEvent}&nbsp;&mdash;&nbsp;${this._timeFinishEvent}</p>
      </div>`.trim();
  }
}

