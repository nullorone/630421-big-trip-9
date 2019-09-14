import Abstract from "./abstract";
import moment from "moment";

export default class Day extends Abstract {
  constructor(event, dayCount) {
    super();
    this._dayTime = event;
    this._dayCount = dayCount || ``;
  }

  getTemplate() {
    return `
    <li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${this._dayCount}</span>
        <time class="day__date" datetime="${this._dayTime ? moment(this._dayTime.time.timeStartEvent).format(`MMM D`) : ``}">${this._dayTime ? moment(this._dayTime.time.timeStartEvent).format(`MMM D`) : ``}</time>
      </div>

      <ul class="trip-events__list">
        
      </ul>
    </li>`.trim();
  }
}

