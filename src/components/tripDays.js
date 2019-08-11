// Размечаем список путешествий
import {generateTripDay} from "./cardDay";

const DAY_COUNT = 3;

const getTripDaysListMarkup = () => `
    <ul class="trip-days">
      ${generateTripDay(DAY_COUNT)}
    </ul>
`;

export {getTripDaysListMarkup};

