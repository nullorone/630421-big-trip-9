// Размечаем список путешествий
import {generateTripEvent} from "./tripEvent";
import {getFormEditEventMarkup} from "./formEditEvent";


const getTripDaysListMarkup = (events) => {
  const firstDay = events[0];
  const {time: {timeStartEvent}} = firstDay;
  return `
<ul class="trip-days">
    <li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">1</span>
        <time class="day__date" datetime="${new Date(timeStartEvent).toISOString().substr(0, 10)}">${new Date(timeStartEvent).toDateString().substr(4, 6)}</time>
      </div>

      <ul class="trip-events__list">
        ${getFormEditEventMarkup(firstDay)}
        ${generateTripEvent(events.slice(1))}
      </ul>
    </li>
</ul>
`;
};

export {getTripDaysListMarkup};

