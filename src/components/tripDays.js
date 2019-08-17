// Размечаем список путешествий
import {generateTripEvent} from "./tripEvent";
import {getFormEditEventMarkup} from "./formEditEvent";

const EVENT_COUNT = 3;

const getTripDaysListMarkup = () => `
<ul class="trip-days">
    <li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">1</span>
        <time class="day__date" datetime="2019-03-18">MAR 18</time>
      </div>

      <ul class="trip-events__list">
        ${getFormEditEventMarkup()}
        ${generateTripEvent(EVENT_COUNT)}
      </ul>
    </li>
</ul>
`;

export {getTripDaysListMarkup};

