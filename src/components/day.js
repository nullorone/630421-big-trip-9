import {createElement} from "../utils/util";

export default class Day {
  constructor(dayTime, dayCount) {
    this._dayTime = dayTime;
    this._dayCount = dayCount;
    this._element = null;
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

  getFormattingIsoTime(time) {
    return new Date(time).toISOString().substr(0, 10);
  }

  getFormattingTime(time) {
    return new Date(time).toDateString().substr(4, 6);
  }

  getTemplate() {
    return `
    <li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${this._dayCount}</span>
        <time class="day__date" datetime="${this.getFormattingIsoTime(this._dayTime)}">${this.getFormattingTime(this._dayTime)}</time>
      </div>

      <ul class="trip-events__list">
        
      </ul>
    </li>`.trim();
  }
}

