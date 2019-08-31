import Event from "./event";
import EventEdit from "./eventEdit";
import {createElement} from "../utils/util";

export default class Days {
  constructor(events) {
    this._events = events;
    this._element = null;
    this._hasEventEdit = false;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  getFormattingIsoTime(time) {
    return new Date(time).toISOString().substr(0, 10);
  }

  getFormattingTime(time) {
    return new Date(time).toDateString().substr(4, 6);
  }

  getFirstEventOfDay(firstDay) {
    if (this._hasEventEdit) {
      return new Event(firstDay).getTemplate();
    } else {
      this._hasEventEdit = true;
      return new EventEdit(firstDay).getTemplate();
    }
  }

  getTripDays() {
    return this._events.map(({time: {timeStartEvent}}) => new Date(timeStartEvent).toDateString());
  }

  getUniqueDays() {
    return Array.from(new Set(this.getTripDays())).map((time) => {
      const filteredEvents = this._events.filter((event) => new Date(event.time.timeStartEvent).toDateString() === time);
      return [time, filteredEvents];
    });
  }

  getTemplate() {
    const days = this.getUniqueDays();
    return `
<ul class="trip-days">
    ${days.map(([dayTime, dayEvents], index) => `
        <li class="trip-days__item  day">
          <div class="day__info">
            <span class="day__counter">${index + 1}</span>
            <time class="day__date" datetime="${this.getFormattingIsoTime(dayTime)}">${this.getFormattingTime(dayTime)}</time>
          </div>
    
          <ul class="trip-events__list">
            ${this.getFirstEventOfDay(dayEvents[0])}
            ${dayEvents.slice(1).map((dayEvent) => new Event(dayEvent).getTemplate()).join(``)}
          </ul>
        </li>`.trim()).join(``)}
</ul>`;
  }
}

