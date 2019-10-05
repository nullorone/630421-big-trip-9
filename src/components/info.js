import Abstract from "./abstract";
import moment from "moment";

const SEPARATOR_CITIES = ` \u2014 `;

export default class Info extends Abstract {
  constructor(events) {
    super();
    this._events = events;
    this._cities = this._getCitiesEvents();
  }

  getTemplate() {
    return `
      <div class="trip-info__main">
        ${this._getInfoTitle()}
          <p class="trip-info__dates">${this._getDate(this._events[0].time.timeStartEvent)}&nbsp;&mdash;&nbsp;${this._getDate(this._events[this._events.length - 1].time.timeFinishEvent)}</p>
      </div>`.trim();
  }

  _getCitiesEvents() {
    return this._events.map(({city}) => city);
  }

  _getInfoTitle() {
    if (this._cities.length > 3) {
      return `<h1 class="trip-info__title">${this._cities[0]} &mdash; ... &mdash; ${this._cities[this._cities.length - 1]}</h1>`;
    } else if (this._cities.length === 1) {
      return `<h1 class="trip-info__title">${this._cities}${SEPARATOR_CITIES}${this._cities}</h1>`;
    } else {
      return `<h1 class="trip-info__title">${this._cities.join(SEPARATOR_CITIES)}</h1>`;
    }
  }

  _getDate(time) {
    return moment(time).format(`MMM DD`);
  }
}

