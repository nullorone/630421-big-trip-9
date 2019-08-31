import {createElement} from "../utils/util";

export default class Info {
  constructor(events) {
    this._events = events;
    this._element = null;
    this._cities = this.getCitiesEvents();
    this._timeStartEvent = this.formattingTimeStartFirstEvent;
    this._timeFinishEvent = this.formattingTimeFinishLastEvent;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  getCitiesEvents() {
    const cities = this._events.map(({city}) => city);
    return cities.length <= 3 ? cities.join(`-`) : cities;
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
        ${this._cities.length > 3 ?
    `<h1 class="trip-info__title">${this._cities[0]} &mdash; ... &mdash; ${this._cities[this._cities.length - 1]}</h1>` :
    `<h1 class="trip-info__title">${this._cities}</h1>`}
          <p class="trip-info__dates">${this._timeStartEvent}&nbsp;&mdash;&nbsp;${this._timeFinishEvent}</p>
      </div>`.trim();
  }
}

