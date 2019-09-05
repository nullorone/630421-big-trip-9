import Abstract from "./abstract";

export default class Day extends Abstract {
  constructor({
    time: {
      timeStartEvent,
    }
  }, dayCount) {
    super();
    this._dayTime = timeStartEvent;
    this._dayCount = dayCount;
  }

  getFormattingIsoTime(time) {
    return new Date(+time).toISOString().substr(0, 10);
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

