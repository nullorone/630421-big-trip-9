import {getSortMarkup} from "./sort";
import {getFormEditEventMarkup} from "./formEditEvent";
import {getTripDaysListMarkup} from "./tripDays";


const getCombineMainMarkup = () => getSortMarkup() + getFormEditEventMarkup() + getTripDaysListMarkup();

export {getCombineMainMarkup};

