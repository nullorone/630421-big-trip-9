// Размечаем список путешествий
import {getTripEventMarkup} from "./tripEvent";
import {getFormEditEventMarkup, hasEventEdit} from "./formEditEvent";

const getTripDaysListMarkup = (events) => {
  const tripDays = events.map(({time: {timeStartEvent}}) => new Date(timeStartEvent).toDateString());
  const uniqueDays = Array.from(new Set(tripDays));
  const days = uniqueDays.map((time) => {
    const filteredEvents = events.filter((event) => new Date(event.time.timeStartEvent).toDateString() === time);
    return [time, filteredEvents];
  });
  let countDay = 0;
  return `
<ul class="trip-days">
    ${days.map(([dayTime, dayEvents], index) => {
    if (dayEvents.length) {
      return `
        <li class="trip-days__item  day">
          <div class="day__info">
            <span class="day__counter">${index + 1 + countDay}</span>
            <time class="day__date" datetime="${new Date(dayTime).toISOString().substr(0, 10)}">${new Date(dayTime).toDateString().substr(4, 6)}</time>
          </div>
    
          <ul class="trip-events__list">
            ${hasEventEdit ? getTripEventMarkup(dayEvents[0]) : getFormEditEventMarkup(dayEvents[0])}
            ${dayEvents.slice(1).map(getTripEventMarkup).join(``)}
          </ul>
        </li>`.trim();
    } else {
      countDay++;
      return ``;
    }
  }).join(``)}
</ul>`;
};

export {getTripDaysListMarkup};

